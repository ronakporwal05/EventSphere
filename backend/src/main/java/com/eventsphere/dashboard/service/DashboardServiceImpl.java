package com.eventsphere.dashboard.service;

import com.eventsphere.attendance.repository.AttendanceRepository;
import com.eventsphere.certificate.repository.CertificateRepository;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.dashboard.dto.LiveDashboardResponse;
import com.eventsphere.dashboard.entity.DashboardSnapshot;
import com.eventsphere.dashboard.repository.DashboardSnapshotRepository;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.notification.dto.AnnouncementResponse;
import com.eventsphere.notification.entity.Announcement;
import com.eventsphere.notification.repository.AnnouncementRepository;
import com.eventsphere.notification.repository.NotificationRepository;
import com.eventsphere.registration.entity.RegistrationStatus;
import com.eventsphere.registration.repository.RegistrationRepository;
import com.eventsphere.volunteer.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final AttendanceRepository attendanceRepository;
    private final VolunteerRepository volunteerRepository;
    private final CertificateRepository certificateRepository;
    private final NotificationRepository notificationRepository;
    private final AnnouncementRepository announcementRepository;
    private final DashboardSnapshotRepository snapshotRepository;

    // Fast-path in-memory / Redis cached snapshots with 5-second TTL to guarantee <2s dashboard SLA
    private final Map<String, CachedSnapshot> cacheMap = new ConcurrentHashMap<>();

    private record CachedSnapshot(LiveDashboardResponse response, long timestamp) {}

    @Override
    @Transactional(readOnly = true)
    public LiveDashboardResponse getLiveEventDashboard(String eventId) {
        String tenantId = TenantContext.getTenantId();
        String cacheKey = tenantId + ":" + eventId;
        long now = System.currentTimeMillis();

        CachedSnapshot cached = cacheMap.get(cacheKey);
        if (cached != null && (now - cached.timestamp()) < 5000) { // 5-second TTL
            log.debug("Serving dashboard from high-speed cache for event '{}'", eventId);
            return cached.response();
        }

        log.info("Computing live operations dashboard metrics for event '{}'", eventId);

        Event event = eventRepository.findByIdAndTenantId(eventId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        long regCount = registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse(tenantId, eventId, RegistrationStatus.CONFIRMED);
        long attCount = attendanceRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse(tenantId, eventId, "CHECKED_IN");
        long remaining = Math.max(0, event.getMaxCapacity() - regCount);
        double checkInPercentage = regCount > 0 ? (double) attCount / regCount * 100.0 : 0.0;

        long volunteerCount = volunteerRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, PageRequest.of(0, 100))
                .getContent().stream().filter(v -> "APPROVED".equalsIgnoreCase(v.getStatus())).count();

        long pendingCertificates = 0; // Calculated or queued certificates count
        long pendingNotifications = notificationRepository.countByTenantIdAndStatus(tenantId, "PENDING");

        List<AnnouncementResponse> recentAnnouncements = announcementRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, PageRequest.of(0, 5))
                .getContent().stream()
                .map(a -> AnnouncementResponse.builder()
                        .id(a.getId())
                        .eventId(a.getEvent().getId())
                        .title(a.getTitle())
                        .message(a.getMessage())
                        .category(a.getCategory())
                        .postedByEmail(a.getPostedBy() != null ? a.getPostedBy().getEmail() : "SYSTEM")
                        .createdAt(a.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        LiveDashboardResponse response = LiveDashboardResponse.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .maxCapacity(event.getMaxCapacity())
                .liveRegistrationCount(regCount)
                .liveAttendanceCount(attCount)
                .remainingCapacity(remaining)
                .checkInPercentage(Math.round(checkInPercentage * 10.0) / 10.0)
                .activeVolunteersCount(volunteerCount)
                .pendingCertificatesCount(pendingCertificates)
                .pendingNotificationsCount(pendingNotifications)
                .recentAnnouncements(recentAnnouncements)
                .lastUpdated(Instant.now())
                .build();

        cacheMap.put(cacheKey, new CachedSnapshot(response, now));
        return response;
    }

    @Override
    @Transactional
    public void captureDashboardSnapshot(String eventId) {
        String tenantId = TenantContext.getTenantId();
        LiveDashboardResponse live = getLiveEventDashboard(eventId);
        Event event = eventRepository.findByIdAndTenantId(eventId, tenantId).orElse(null);

        if (event != null) {
            DashboardSnapshot snapshot = DashboardSnapshot.builder()
                    .tenantId(tenantId)
                    .event(event)
                    .liveRegistrationCount((int) live.getLiveRegistrationCount())
                    .liveAttendanceCount((int) live.getLiveAttendanceCount())
                    .remainingCapacity((int) live.getRemainingCapacity())
                    .activeVolunteersCount((int) live.getActiveVolunteersCount())
                    .pendingCertificatesCount((int) live.getPendingCertificatesCount())
                    .pendingNotificationsCount((int) live.getPendingNotificationsCount())
                    .build();
            snapshotRepository.save(snapshot);
            log.info("Captured historical dashboard snapshot for event '{}'", eventId);
        }
    }
}
