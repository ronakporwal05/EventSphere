package com.eventsphere.capacity.service;

import com.eventsphere.capacity.dto.RegistrationDashboardResponse;
import com.eventsphere.capacity.dto.RegistrationStatsResponse;
import com.eventsphere.capacity.dto.WaitlistResponse;
import com.eventsphere.capacity.entity.WaitlistEntry;
import com.eventsphere.capacity.repository.WaitlistRepository;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.entity.RegistrationStatus;
import com.eventsphere.registration.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CapacityServiceImpl implements CapacityService {

    private final WaitlistRepository waitlistRepository;
    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    @Override
    @Transactional
    public WaitlistResponse addToWaitlist(String registrationId) {
        String tenantId = TenantContext.getTenantId();
        log.info("Adding registration '{}' to waitlist", registrationId);

        Registration reg = registrationRepository.findByIdAndTenantIdAndDeletedFalse(registrationId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        if (reg.getStatus() == RegistrationStatus.CONFIRMED) {
            throw new ResourceConflictException("Registration is already confirmed.");
        }

        long currentWaitlistCount = waitlistRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse(tenantId, reg.getEvent().getId(), "WAITING");

        WaitlistEntry entry = WaitlistEntry.builder()
                .tenantId(tenantId)
                .event(reg.getEvent())
                .registration(reg)
                .position((int) currentWaitlistCount + 1)
                .status("WAITING")
                .build();

        reg.setStatus(RegistrationStatus.WAITLISTED);
        registrationRepository.save(reg);

        WaitlistEntry saved = waitlistRepository.save(entry);
        log.info("Registration '{}' added to waitlist at position {}", registrationId, saved.getPosition());
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void promoteNextWaitlistedAttendee(String eventId) {
        String tenantId = TenantContext.getTenantId();
        log.info("Checking automatic promotion for event '{}'", eventId);

        Event event = eventRepository.findByIdAndTenantId(eventId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        long confirmedCount = registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse(tenantId, eventId, RegistrationStatus.CONFIRMED);

        if (event.getMaxCapacity() != null && confirmedCount >= event.getMaxCapacity()) {
            log.info("Cannot promote waitlisted attendee. Event is at full capacity ({}/{})", confirmedCount, event.getMaxCapacity());
            return;
        }

        Optional<WaitlistEntry> nextEntryOpt = waitlistRepository.findFirstByTenantIdAndEventIdAndStatusAndDeletedFalseOrderByPositionAsc(tenantId, eventId, "WAITING");

        if (nextEntryOpt.isPresent()) {
            WaitlistEntry entry = nextEntryOpt.get();
            entry.setStatus("PROMOTED");
            entry.setPromotedAt(Instant.now());
            waitlistRepository.save(entry);

            Registration reg = entry.getRegistration();
            reg.setStatus(RegistrationStatus.CONFIRMED);
            registrationRepository.save(reg);

            log.info("Auto-promoted registration '{}' ({}) from waitlist to CONFIRMED.", reg.getId(), reg.getAttendeeEmail());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<WaitlistResponse> getWaitlistByEvent(String eventId) {
        String tenantId = TenantContext.getTenantId();
        return waitlistRepository.findByTenantIdAndEventIdAndStatusAndDeletedFalseOrderByPositionAsc(tenantId, eventId, "WAITING").stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RegistrationStatsResponse getRegistrationStats(String eventId) {
        String tenantId = TenantContext.getTenantId();
        Event event = eventRepository.findByIdAndTenantId(eventId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        long confirmed = registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse(tenantId, eventId, RegistrationStatus.CONFIRMED);
        long pending = registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse(tenantId, eventId, RegistrationStatus.PENDING);
        long cancelled = registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse(tenantId, eventId, RegistrationStatus.CANCELLED);
        long waitlisted = waitlistRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse(tenantId, eventId, "WAITING");

        double occupancyRate = 0.0;
        if (event.getMaxCapacity() != null && event.getMaxCapacity() > 0) {
            occupancyRate = ((double) confirmed / event.getMaxCapacity()) * 100.0;
        }

        return RegistrationStatsResponse.builder()
                .eventId(eventId)
                .maxCapacity(event.getMaxCapacity())
                .totalConfirmed(confirmed)
                .totalPending(pending)
                .totalCancelled(cancelled)
                .totalWaitlisted(waitlisted)
                .occupancyRatePercentage(Math.round(occupancyRate * 100.0) / 100.0)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public RegistrationDashboardResponse getRegistrationDashboard(String eventId) {
        RegistrationStatsResponse stats = getRegistrationStats(eventId);
        List<WaitlistResponse> waitlist = getWaitlistByEvent(eventId);

        return RegistrationDashboardResponse.builder()
                .stats(stats)
                .recentWaitlist(waitlist)
                .build();
    }

    private WaitlistResponse mapToResponse(WaitlistEntry w) {
        return WaitlistResponse.builder()
                .id(w.getId())
                .eventId(w.getEvent().getId())
                .registrationId(w.getRegistration().getId())
                .attendeeName(w.getRegistration().getAttendeeName())
                .attendeeEmail(w.getRegistration().getAttendeeEmail())
                .position(w.getPosition())
                .status(w.getStatus())
                .createdAt(w.getCreatedAt())
                .promotedAt(w.getPromotedAt())
                .build();
    }
}
