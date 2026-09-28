package com.eventsphere.registration.service;

import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.entity.EventState;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.registration.dto.RegistrationRequest;
import com.eventsphere.registration.dto.RegistrationResponse;
import com.eventsphere.registration.dto.RegistrationStatusUpdateRequest;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.entity.RegistrationStatus;
import com.eventsphere.registration.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RegistrationResponse registerAttendee(String userId, RegistrationRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Processing registration for email '{}' on event '{}'", request.getAttendeeEmail(), request.getEventId());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        // Rule 1: Validate event state
        if (event.getStatus() != EventState.PUBLISHED && event.getStatus() != EventState.REGISTRATION_OPEN) {
            throw new ResourceConflictException("Event is not currently open for registration. Current status: " + event.getStatus());
        }

        // Rule 2: Validate registration deadline
        if (event.getRegistrationDeadline() != null && Instant.now().isAfter(event.getRegistrationDeadline())) {
            throw new ResourceConflictException("Registration deadline for this event has passed.");
        }

        // Rule 3: Check duplicate registration
        if (registrationRepository.existsByTenantIdAndEventIdAndAttendeeEmailAndDeletedFalse(tenantId, event.getId(), request.getAttendeeEmail())) {
            throw new ResourceConflictException("Attendee with email '" + request.getAttendeeEmail() + "' is already registered for this event.");
        }

        // Rule 4: Validate capacity
        long confirmedCount = registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse(tenantId, event.getId(), RegistrationStatus.CONFIRMED);
        if (event.getMaxCapacity() != null && confirmedCount >= event.getMaxCapacity()) {
            throw new ResourceConflictException("Event capacity reached maximum limit of " + event.getMaxCapacity());
        }

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        String regNumber = "REG-" + (event.getSlug() != null ? event.getSlug().toUpperCase() : "EVT") + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Registration registration = Registration.builder()
                .tenantId(tenantId)
                .event(event)
                .user(user)
                .attendeeName(request.getAttendeeName())
                .attendeeEmail(request.getAttendeeEmail().toLowerCase().trim())
                .attendeePhone(request.getAttendeePhone())
                .registrationNumber(regNumber)
                .status(RegistrationStatus.CONFIRMED)
                .registrationDate(Instant.now())
                .build();

        Registration saved = registrationRepository.save(registration);
        log.info("Registration successful. Registration Number: {}", regNumber);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public RegistrationResponse getRegistrationById(String id) {
        String tenantId = TenantContext.getTenantId();
        Registration reg = registrationRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + id));
        return mapToResponse(reg);
    }

    @Override
    @Transactional(readOnly = true)
    public RegistrationResponse getRegistrationByNumber(String registrationNumber) {
        String tenantId = TenantContext.getTenantId();
        Registration reg = registrationRepository.findByTenantIdAndRegistrationNumberAndDeletedFalse(tenantId, registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with number: " + registrationNumber));
        return mapToResponse(reg);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RegistrationResponse> getRegistrationsByEvent(String eventId, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return registrationRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public RegistrationResponse updateRegistrationStatus(String id, RegistrationStatusUpdateRequest request) {
        String tenantId = TenantContext.getTenantId();
        Registration reg = registrationRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + id));

        reg.setStatus(request.getStatus());
        if (request.getReason() != null) {
            reg.setCancellationReason(request.getReason());
        }

        Registration saved = registrationRepository.save(reg);
        log.info("Updated registration ID '{}' status to {}", id, request.getStatus());
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void cancelRegistration(String id, String reason) {
        String tenantId = TenantContext.getTenantId();
        Registration reg = registrationRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + id));

        reg.setStatus(RegistrationStatus.CANCELLED);
        reg.setCancellationReason(reason != null ? reason : "Cancelled by user");
        registrationRepository.save(reg);
        log.info("Cancelled registration ID: {}", id);
    }

    private RegistrationResponse mapToResponse(Registration reg) {
        return RegistrationResponse.builder()
                .id(reg.getId())
                .eventId(reg.getEvent().getId())
                .eventTitle(reg.getEvent().getTitle())
                .userId(reg.getUser() != null ? reg.getUser().getId() : null)
                .attendeeName(reg.getAttendeeName())
                .attendeeEmail(reg.getAttendeeEmail())
                .attendeePhone(reg.getAttendeePhone())
                .registrationNumber(reg.getRegistrationNumber())
                .status(reg.getStatus())
                .registrationDate(reg.getRegistrationDate())
                .cancellationReason(reg.getCancellationReason())
                .createdAt(reg.getCreatedAt())
                .build();
    }
}
