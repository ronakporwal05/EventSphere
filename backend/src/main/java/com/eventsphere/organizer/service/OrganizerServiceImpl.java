package com.eventsphere.organizer.service;

import com.eventsphere.attendance.dto.CheckInRequest;
import com.eventsphere.attendance.dto.AttendanceResponse;
import com.eventsphere.attendance.service.AttendanceService;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.notification.dto.NotificationSendRequest;
import com.eventsphere.notification.service.NotificationService;
import com.eventsphere.organizer.dto.*;
import com.eventsphere.organizer.entity.OrganizerAction;
import com.eventsphere.organizer.entity.PrintedBadge;
import com.eventsphere.organizer.repository.OrganizerActionRepository;
import com.eventsphere.organizer.repository.PrintedBadgeRepository;
import com.eventsphere.registration.dto.RegistrationRequest;
import com.eventsphere.registration.dto.RegistrationResponse;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.repository.RegistrationRepository;
import com.eventsphere.registration.service.RegistrationService;
import com.eventsphere.ticket.dto.TicketGenerateRequest;
import com.eventsphere.ticket.dto.TicketResponse;
import com.eventsphere.ticket.entity.Ticket;
import com.eventsphere.ticket.repository.TicketRepository;
import com.eventsphere.ticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizerServiceImpl implements OrganizerService {

    private final RegistrationService registrationService;
    private final TicketService ticketService;
    private final AttendanceService attendanceService;
    private final NotificationService notificationService;

    private final RegistrationRepository registrationRepository;
    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final PrintedBadgeRepository printedBadgeRepository;
    private final OrganizerActionRepository organizerActionRepository;

    @Override
    @Transactional
    public WalkInRegistrationResponse processWalkInRegistration(String currentUserId, WalkInRegistrationRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Processing walk-in registration for '{}' at event '{}'", request.getAttendeeEmail(), request.getEventId());

        User organizer = userRepository.findById(currentUserId).orElse(null);

        // 1. Create Registration
        RegistrationRequest regReq = RegistrationRequest.builder()
                .eventId(request.getEventId())
                .attendeeName(request.getAttendeeName())
                .attendeeEmail(request.getAttendeeEmail())
                .attendeePhone(request.getAttendeePhone())
                .build();
        RegistrationResponse regResponse = registrationService.registerAttendee(currentUserId, regReq);

        // 2. Issue Ticket
        TicketResponse ticketResponse = ticketService.generateTicket(TicketGenerateRequest.builder()
                .registrationId(regResponse.getId())
                .ticketTypeId(request.getTicketTypeId())
                .build());

        // 3. Optional Immediate Check-in
        AttendanceResponse attResponse = null;
        if (request.isAutoCheckIn()) {
            CheckInRequest checkInReq = CheckInRequest.builder()
                    .eventId(request.getEventId())
                    .ticketId(ticketResponse.getId())
                    .checkInMethod("MANUAL")
                    .notes("Walk-in desk auto check-in")
                    .build();
            attResponse = attendanceService.checkIn(currentUserId, checkInReq);
        }

        // Audit Log
        organizerActionRepository.save(OrganizerAction.builder()
                .tenantId(tenantId)
                .event(eventRepository.findByIdAndTenantId(request.getEventId(), tenantId).orElse(null))
                .organizer(organizer)
                .actionType("WALK_IN_REGISTRATION")
                .targetEntityId(regResponse.getId())
                .details("Registered walk-in attendee: " + request.getAttendeeName())
                .build());

        return WalkInRegistrationResponse.builder()
                .registration(regResponse)
                .ticket(ticketResponse)
                .attendance(attResponse)
                .message("Walk-in attendee registered successfully" + (request.isAutoCheckIn() ? " and checked in." : "."))
                .build();
    }

    @Override
    @Transactional
    public BadgePrintResponse printBadge(String currentUserId, String registrationId, String badgeType) {
        String tenantId = TenantContext.getTenantId();
        Registration reg = registrationRepository.findByIdAndTenantIdAndDeletedFalse(registrationId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        User organizer = userRepository.findById(currentUserId).orElse(null);

        PrintedBadge badge = printedBadgeRepository.findByTenantIdAndRegistrationId(tenantId, registrationId)
                .orElseGet(() -> PrintedBadge.builder()
                        .tenantId(tenantId)
                        .event(reg.getEvent())
                        .registration(reg)
                        .badgeType(badgeType != null ? badgeType.toUpperCase() : "ATTENDEE")
                        .printedBy(organizer)
                        .printCount(0)
                        .build());

        badge.setPrintCount(badge.getPrintCount() + 1);
        badge.setLastPrintedAt(Instant.now());
        PrintedBadge saved = printedBadgeRepository.save(badge);

        // ZPL Command Payload for thermal printers (Zebra, Citizen)
        String zplCode = "^XA^FO50,50^A0N,50,50^FD" + reg.getAttendeeName() + "^FS^FO50,120^A0N,30,30^FD" + reg.getEvent().getTitle() + "^FS^FO50,180^A0N,25,25^FD" + saved.getBadgeType() + "^FS^XZ";

        // Audit Log
        organizerActionRepository.save(OrganizerAction.builder()
                .tenantId(tenantId)
                .event(reg.getEvent())
                .organizer(organizer)
                .actionType("BADGE_PRINT")
                .targetEntityId(reg.getId())
                .details("Printed badge copy #" + saved.getPrintCount() + " for " + reg.getAttendeeName())
                .build());

        return BadgePrintResponse.builder()
                .id(saved.getId())
                .registrationId(reg.getId())
                .attendeeName(reg.getAttendeeName())
                .attendeeEmail(reg.getAttendeeEmail())
                .badgeType(saved.getBadgeType())
                .printCount(saved.getPrintCount())
                .zplCode(zplCode)
                .lastPrintedAt(saved.getLastPrintedAt())
                .build();
    }

    @Override
    @Transactional
    public TicketResponse reissueTicket(String currentUserId, String ticketId) {
        String tenantId = TenantContext.getTenantId();
        User organizer = userRepository.findById(currentUserId).orElse(null);

        TicketResponse reissued = ticketService.regenerateTicket(ticketId);

        organizerActionRepository.save(OrganizerAction.builder()
                .tenantId(tenantId)
                .organizer(organizer)
                .actionType("TICKET_REISSUE")
                .targetEntityId(ticketId)
                .details("Reissued ticket ID: " + ticketId + " -> New Number: " + reissued.getTicketNumber())
                .build());

        return reissued;
    }

    @Override
    @Transactional
    public TicketResponse recoverLostTicket(String currentUserId, LostTicketRecoveryRequest request) {
        String tenantId = TenantContext.getTenantId();
        User organizer = userRepository.findById(currentUserId).orElse(null);

        Registration reg = registrationRepository.findByTenantIdAndEventIdAndAttendeeEmailAndDeletedFalse(tenantId, request.getEventId(), request.getAttendeeEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No registration found with email: " + request.getAttendeeEmail()));

        Ticket ticket = ticketRepository.findByTenantIdAndRegistrationIdAndDeletedFalse(tenantId, reg.getId())
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No active ticket found for attendee"));

        // Dispatch Email Recovery
        NotificationSendRequest emailReq = NotificationSendRequest.builder()
                .eventId(request.getEventId())
                .recipientEmail(reg.getAttendeeEmail())
                .recipientName(reg.getAttendeeName())
                .subject("Ticket Recovery - " + reg.getEvent().getTitle())
                .content("Hello " + reg.getAttendeeName() + ",\nYour ticket number is: " + ticket.getTicketNumber())
                .build();
        notificationService.sendNotification(emailReq);

        organizerActionRepository.save(OrganizerAction.builder()
                .tenantId(tenantId)
                .event(reg.getEvent())
                .organizer(organizer)
                .actionType("LOST_TICKET_RECOVERY")
                .targetEntityId(ticket.getId())
                .details("Recovered ticket for " + reg.getAttendeeEmail())
                .build());

        return ticketService.getTicketById(ticket.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RegistrationResponse> searchRegistrations(String eventId, String query, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return registrationRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, pageable)
                .map(r -> RegistrationResponse.builder()
                        .id(r.getId())
                        .eventId(r.getEvent().getId())
                        .attendeeName(r.getAttendeeName())
                        .attendeeEmail(r.getAttendeeEmail())
                        .attendeePhone(r.getAttendeePhone())
                        .status(r.getStatus())
                        .createdAt(r.getCreatedAt())
                        .build());
    }
}
