package com.eventsphere.ticket.service;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.repository.RegistrationRepository;
import com.eventsphere.ticket.dto.*;
import com.eventsphere.ticket.entity.Ticket;
import com.eventsphere.ticket.entity.TicketStatus;
import com.eventsphere.ticket.entity.TicketType;
import com.eventsphere.ticket.repository.TicketRepository;
import com.eventsphere.ticket.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    @Transactional
    public TicketTypeResponse createTicketType(TicketTypeRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating ticket type '{}' for event '{}'", request.getName(), request.getEventId());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        if (ticketTypeRepository.existsByTenantIdAndEventIdAndNameAndDeletedFalse(tenantId, event.getId(), request.getName())) {
            throw new ResourceConflictException("Ticket type '" + request.getName() + "' already exists for this event.");
        }

        TicketType ticketType = TicketType.builder()
                .tenantId(tenantId)
                .event(event)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .totalQuantity(request.getTotalQuantity())
                .availableQuantity(request.getTotalQuantity())
                .active(true)
                .build();

        TicketType saved = ticketTypeRepository.save(ticketType);
        return mapToTypeResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketTypeResponse> getTicketTypesByEvent(String eventId) {
        String tenantId = TenantContext.getTenantId();
        return ticketTypeRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId).stream()
                .map(this::mapToTypeResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TicketResponse generateTicket(TicketGenerateRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Generating ticket for registration '{}'", request.getRegistrationId());

        Registration reg = registrationRepository.findByIdAndTenantIdAndDeletedFalse(request.getRegistrationId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + request.getRegistrationId()));

        TicketType ticketType = ticketTypeRepository.findByIdAndTenantIdAndDeletedFalse(request.getTicketTypeId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket type not found with ID: " + request.getTicketTypeId()));

        if (ticketType.getAvailableQuantity() <= 0) {
            throw new ResourceConflictException("Ticket type '" + ticketType.getName() + "' is sold out.");
        }

        // Deduct quantity
        ticketType.setAvailableQuantity(ticketType.getAvailableQuantity() - 1);
        ticketTypeRepository.save(ticketType);

        String ticketNumber = "TCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Ticket ticket = Ticket.builder()
                .tenantId(tenantId)
                .event(reg.getEvent())
                .registration(reg)
                .ticketType(ticketType)
                .ticketNumber(ticketNumber)
                .status(TicketStatus.ISSUED)
                .issuedAt(Instant.now())
                .expiresAt(request.getExpiresAt())
                .build();

        Ticket saved = ticketRepository.save(ticket);
        log.info("Successfully generated ticket number: {}", ticketNumber);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse getTicketById(String id) {
        String tenantId = TenantContext.getTenantId();
        Ticket ticket = ticketRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + id));
        return mapToResponse(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse getTicketByNumber(String ticketNumber) {
        String tenantId = TenantContext.getTenantId();
        Ticket ticket = ticketRepository.findByTenantIdAndTicketNumberAndDeletedFalse(tenantId, ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ticket number: " + ticketNumber));
        return mapToResponse(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponse> getTicketsByEvent(String eventId, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return ticketRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public TicketResponse revokeTicket(String id, String reason) {
        String tenantId = TenantContext.getTenantId();
        Ticket ticket = ticketRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + id));

        ticket.setStatus(TicketStatus.REVOKED);
        ticket.setRevocationReason(reason != null ? reason : "Revoked by event admin");

        Ticket saved = ticketRepository.save(ticket);
        log.info("Revoked ticket ID: {}", id);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public TicketResponse regenerateTicket(String id) {
        String tenantId = TenantContext.getTenantId();
        Ticket ticket = ticketRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + id));

        if (ticket.getStatus() == TicketStatus.REVOKED) {
            throw new ResourceConflictException("Cannot regenerate a revoked ticket.");
        }

        String newNumber = "TCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        ticket.setTicketNumber(newNumber);
        ticket.setIssuedAt(Instant.now());
        ticket.setStatus(TicketStatus.ISSUED);

        Ticket saved = ticketRepository.save(ticket);
        log.info("Regenerated ticket ID '{}' with new number: {}", id, newNumber);
        return mapToResponse(saved);
    }

    @Override
    public TicketLockResponse holdTicket(String ticketTypeId, String userId, long holdDurationSeconds) {
        String tenantId = TenantContext.getTenantId();
        long duration = holdDurationSeconds > 0 ? holdDurationSeconds : 600; // default 10 mins

        TicketType ticketType = ticketTypeRepository.findByIdAndTenantIdAndDeletedFalse(ticketTypeId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket type not found with ID: " + ticketTypeId));

        if (ticketType.getAvailableQuantity() <= 0) {
            return TicketLockResponse.builder()
                    .locked(false)
                    .ticketTypeId(ticketTypeId)
                    .ticketTypeName(ticketType.getName())
                    .userId(userId)
                    .message("Ticket type is sold out. Cannot acquire temporary hold.")
                    .build();
        }

        String lockKey = String.format("lock:ticket:%s:%s", ticketTypeId, userId);
        Boolean acquired = redisTemplate.opsForValue().setIfAbsent(lockKey, "LOCKED", duration, TimeUnit.SECONDS);

        if (Boolean.TRUE.equals(acquired)) {
            Instant expiresAt = Instant.now().plusSeconds(duration);
            log.info("Acquired Redis distributed seat lock for user '{}' on tier '{}' for {}s", userId, ticketTypeId, duration);
            return TicketLockResponse.builder()
                    .locked(true)
                    .lockKey(lockKey)
                    .ticketTypeId(ticketTypeId)
                    .ticketTypeName(ticketType.getName())
                    .userId(userId)
                    .remainingSeconds(duration)
                    .expiresAt(expiresAt)
                    .message("Ticket successfully locked for checkout. You have 10 minutes to complete payment.")
                    .build();
        } else {
            Long ttl = redisTemplate.getExpire(lockKey, TimeUnit.SECONDS);
            return TicketLockResponse.builder()
                    .locked(true)
                    .lockKey(lockKey)
                    .ticketTypeId(ticketTypeId)
                    .ticketTypeName(ticketType.getName())
                    .userId(userId)
                    .remainingSeconds(ttl != null ? ttl : 0)
                    .expiresAt(Instant.now().plusSeconds(ttl != null ? ttl : 0))
                    .message("Existing ticket hold active for this user.")
                    .build();
        }
    }

    @Override
    public boolean releaseTicketHold(String ticketTypeId, String userId) {
        String lockKey = String.format("lock:ticket:%s:%s", ticketTypeId, userId);
        Boolean deleted = redisTemplate.delete(lockKey);
        log.info("Released Redis ticket hold for key '{}'", lockKey);
        return Boolean.TRUE.equals(deleted);
    }

    private TicketTypeResponse mapToTypeResponse(TicketType tt) {
        return TicketTypeResponse.builder()
                .id(tt.getId())
                .eventId(tt.getEvent().getId())
                .name(tt.getName())
                .description(tt.getDescription())
                .price(tt.getPrice())
                .currency(tt.getCurrency())
                .totalQuantity(tt.getTotalQuantity())
                .availableQuantity(tt.getAvailableQuantity())
                .active(tt.isActive())
                .createdAt(tt.getCreatedAt())
                .build();
    }

    private TicketResponse mapToResponse(Ticket t) {
        return TicketResponse.builder()
                .id(t.getId())
                .eventId(t.getEvent().getId())
                .eventTitle(t.getEvent().getTitle())
                .registrationId(t.getRegistration().getId())
                .registrationNumber(t.getRegistration().getRegistrationNumber())
                .attendeeName(t.getRegistration().getAttendeeName())
                .attendeeEmail(t.getRegistration().getAttendeeEmail())
                .ticketTypeId(t.getTicketType().getId())
                .ticketTypeName(t.getTicketType().getName())
                .ticketPrice(t.getTicketType().getPrice())
                .ticketNumber(t.getTicketNumber())
                .status(t.getStatus())
                .issuedAt(t.getIssuedAt())
                .expiresAt(t.getExpiresAt())
                .revocationReason(t.getRevocationReason())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
