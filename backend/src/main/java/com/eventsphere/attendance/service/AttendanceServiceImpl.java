package com.eventsphere.attendance.service;

import com.eventsphere.attendance.dto.*;
import com.eventsphere.attendance.entity.Attendance;
import com.eventsphere.attendance.entity.AttendanceLog;
import com.eventsphere.attendance.repository.AttendanceLogRepository;
import com.eventsphere.attendance.repository.AttendanceRepository;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.qr.dto.QrValidationRequest;
import com.eventsphere.qr.dto.QrValidationResult;
import com.eventsphere.qr.service.QrValidationService;
import com.eventsphere.ticket.entity.Ticket;
import com.eventsphere.ticket.entity.TicketStatus;
import com.eventsphere.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceLogRepository attendanceLogRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final QrValidationService qrValidationService;

    // Fast memory cache for ticket check-in status during high concurrency peak scan hours
    private final Set<String> checkedInTicketCache = ConcurrentHashMap.newKeySet();

    @Override
    @Transactional
    public AttendanceResponse checkIn(String checkedInByUserId, CheckInRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Processing check-in request for event '{}'", request.getEventId());

        Ticket ticket;
        if (request.getQrToken() != null && !request.getQrToken().isBlank()) {
            QrValidationResult qrResult = qrValidationService.validateQrToken(QrValidationRequest.builder().qrToken(request.getQrToken()).build());
            if (!qrResult.isValid()) {
                throw new ResourceConflictException("QR Check-in failed: " + qrResult.getMessage());
            }
            ticket = ticketRepository.findByIdAndTenantIdAndDeletedFalse(qrResult.getTicketId(), tenantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        } else if (request.getTicketNumber() != null && !request.getTicketNumber().isBlank()) {
            ticket = ticketRepository.findByTenantIdAndTicketNumberAndDeletedFalse(tenantId, request.getTicketNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with number: " + request.getTicketNumber()));
        } else if (request.getTicketId() != null && !request.getTicketId().isBlank()) {
            ticket = ticketRepository.findByIdAndTenantIdAndDeletedFalse(request.getTicketId(), tenantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + request.getTicketId()));
        } else {
            throw new ResourceConflictException("Either QR Token, Ticket Number, or Ticket ID must be provided.");
        }

        // Rule 1: Wrong event validation
        if (!ticket.getEvent().getId().equals(request.getEventId())) {
            throw new ResourceConflictException("Ticket does not belong to the requested event.");
        }

        // Rule 2: Expired or Revoked ticket validation
        if (ticket.getStatus() == TicketStatus.REVOKED) {
            throw new ResourceConflictException("Check-in rejected: Ticket is REVOKED.");
        }
        if (ticket.getStatus() == TicketStatus.EXPIRED || (ticket.getExpiresAt() != null && Instant.now().isAfter(ticket.getExpiresAt()))) {
            throw new ResourceConflictException("Check-in rejected: Ticket has EXPIRED.");
        }

        // Rule 3: Fast Cache Check for Duplicate Scan
        String cacheKey = tenantId + ":" + request.getEventId() + ":" + ticket.getId();
        if (checkedInTicketCache.contains(cacheKey) || attendanceRepository.existsByTenantIdAndEventIdAndTicketIdAndDeletedFalse(tenantId, request.getEventId(), ticket.getId())) {
            checkedInTicketCache.add(cacheKey);
            throw new ResourceConflictException("DUPLICATE SCAN REJECTED: Ticket '" + ticket.getTicketNumber() + "' has already checked in.");
        }

        User checkedInBy = null;
        if (checkedInByUserId != null) {
            checkedInBy = userRepository.findById(checkedInByUserId).orElse(null);
        }

        Attendance attendance = Attendance.builder()
                .tenantId(tenantId)
                .event(ticket.getEvent())
                .registration(ticket.getRegistration())
                .ticket(ticket)
                .checkInTime(Instant.now())
                .checkInMethod(request.getCheckInMethod() != null ? request.getCheckInMethod() : "QR_SCAN")
                .checkedInBy(checkedInBy)
                .status("CHECKED_IN")
                .notes(request.getNotes())
                .build();

        Attendance saved = attendanceRepository.save(attendance);

        // Update ticket status to USED
        ticket.setStatus(TicketStatus.USED);
        ticketRepository.save(ticket);

        // Add to Redis/Fast Cache
        checkedInTicketCache.add(cacheKey);

        // Create Attendance Log
        AttendanceLog logEntry = AttendanceLog.builder()
                .tenantId(tenantId)
                .attendance(saved)
                .action("CHECK_IN")
                .performedBy(checkedInBy)
                .details("Checked in via " + saved.getCheckInMethod())
                .build();
        attendanceLogRepository.save(logEntry);

        log.info("Check-in successful for attendee '{}' (Ticket: {})", ticket.getRegistration().getAttendeeName(), ticket.getTicketNumber());
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public List<AttendanceResponse> bulkCheckIn(String checkedInByUserId, BulkCheckInRequest request) {
        log.info("Processing bulk check-in for {} tickets", request.getTicketNumbers().size());
        List<AttendanceResponse> results = new ArrayList<>();

        for (String tckNum : request.getTicketNumbers()) {
            try {
                CheckInRequest singleReq = CheckInRequest.builder()
                        .eventId(request.getEventId())
                        .ticketNumber(tckNum)
                        .checkInMethod("BULK")
                        .notes(request.getNotes())
                        .build();
                results.add(checkIn(checkedInByUserId, singleReq));
            } catch (Exception e) {
                log.warn("Bulk check-in skipped ticket '{}': {}", tckNum, e.getMessage());
            }
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponse getAttendanceById(String id) {
        String tenantId = TenantContext.getTenantId();
        Attendance att = attendanceRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with ID: " + id));
        return mapToResponse(att);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceResponse> searchAttendance(String eventId, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return attendanceRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceLogResponse> getAttendanceHistory(String attendanceId) {
        String tenantId = TenantContext.getTenantId();
        return attendanceLogRepository.findByTenantIdAndAttendanceIdOrderByCreatedAtDesc(tenantId, attendanceId).stream()
                .map(l -> AttendanceLogResponse.builder()
                        .id(l.getId())
                        .attendanceId(l.getAttendance().getId())
                        .action(l.getAction())
                        .performedByEmail(l.getPerformedBy() != null ? l.getPerformedBy().getEmail() : "SYSTEM")
                        .details(l.getDetails())
                        .createdAt(l.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AttendanceResponse updateAttendanceStatus(String currentUserId, String id, AttendanceCorrectionRequest request) {
        String tenantId = TenantContext.getTenantId();
        Attendance att = attendanceRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with ID: " + id));

        User performedBy = userRepository.findById(currentUserId).orElse(null);

        att.setStatus(request.getStatus().toUpperCase());
        if (request.getNotes() != null) {
            att.setNotes(request.getNotes());
        }

        Attendance saved = attendanceRepository.save(att);

        // Record Correction Log
        AttendanceLog logEntry = AttendanceLog.builder()
                .tenantId(tenantId)
                .attendance(saved)
                .action("CORRECTION")
                .performedBy(performedBy)
                .details("Status updated to " + request.getStatus() + ". Notes: " + request.getNotes())
                .build();
        attendanceLogRepository.save(logEntry);

        return mapToResponse(saved);
    }

    private AttendanceResponse mapToResponse(Attendance a) {
        return AttendanceResponse.builder()
                .id(a.getId())
                .eventId(a.getEvent().getId())
                .registrationId(a.getRegistration().getId())
                .attendeeName(a.getRegistration().getAttendeeName())
                .attendeeEmail(a.getRegistration().getAttendeeEmail())
                .ticketId(a.getTicket().getId())
                .ticketNumber(a.getTicket().getTicketNumber())
                .ticketTypeName(a.getTicket().getTicketType().getName())
                .checkInTime(a.getCheckInTime())
                .checkInMethod(a.getCheckInMethod())
                .checkedInByEmail(a.getCheckedInBy() != null ? a.getCheckedInBy().getEmail() : null)
                .status(a.getStatus())
                .notes(a.getNotes())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
