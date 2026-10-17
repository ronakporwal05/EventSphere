package com.eventsphere.notification.service;

import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.notification.dto.*;
import com.eventsphere.notification.entity.Announcement;
import com.eventsphere.notification.entity.EmailLog;
import com.eventsphere.notification.entity.Notification;
import com.eventsphere.notification.provider.EmailProvider;
import com.eventsphere.notification.provider.PushProvider;
import com.eventsphere.notification.repository.AnnouncementRepository;
import com.eventsphere.notification.repository.EmailLogRepository;
import com.eventsphere.notification.repository.NotificationRepository;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailLogRepository emailLogRepository;
    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

    private final EmailProvider emailProvider;
    private final PushProvider pushProvider;

    @Override
    @Transactional
    public NotificationResponse sendNotification(NotificationSendRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Queueing notification to '{}' | Subject: '{}'", request.getRecipientEmail(), request.getSubject());

        Event event = null;
        if (request.getEventId() != null && !request.getEventId().isBlank()) {
            event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId).orElse(null);
        }

        Notification notification = Notification.builder()
                .tenantId(tenantId)
                .event(event)
                .recipientEmail(request.getRecipientEmail().toLowerCase().trim())
                .recipientName(request.getRecipientName())
                .subject(request.getSubject())
                .content(request.getContent())
                .type(request.getType() != null ? request.getType().toUpperCase() : "EMAIL")
                .status("PENDING")
                .retryCount(0)
                .build();

        Notification saved = notificationRepository.save(notification);

        // Trigger Async Sending
        dispatchNotificationAsync(saved.getId(), tenantId);

        return mapToResponse(saved);
    }

    @Async
    @Transactional
    public void dispatchNotificationAsync(String notificationId, String tenantId) {
        TenantContext.setTenantId(tenantId);
        try {
            Notification notification = notificationRepository.findById(notificationId).orElse(null);
            if (notification == null || "SENT".equals(notification.getStatus())) {
                return;
            }

            boolean success = false;
            if ("PUSH".equalsIgnoreCase(notification.getType())) {
                success = pushProvider.sendPushNotification(notification.getRecipientEmail(), notification.getSubject(), notification.getContent());
            } else {
                success = emailProvider.sendEmail(notification.getRecipientEmail(), notification.getSubject(), notification.getContent());
            }

            if (success) {
                notification.setStatus("SENT");
                notification.setSentAt(Instant.now());
                notificationRepository.save(notification);

                EmailLog emailLog = EmailLog.builder()
                        .tenantId(tenantId)
                        .notification(notification)
                        .providerName(emailProvider.getProviderName())
                        .recipientEmail(notification.getRecipientEmail())
                        .status("DELIVERED")
                        .responsePayload("OK 200 - Delivered")
                        .build();
                emailLogRepository.save(emailLog);
                log.info("Notification ID '{}' successfully SENT", notificationId);
            } else {
                handleNotificationFailure(notification, tenantId, "Provider delivery returned false");
            }
        } catch (Exception e) {
            log.error("Failed async notification delivery for ID '{}'", notificationId, e);
            Notification notification = notificationRepository.findById(notificationId).orElse(null);
            if (notification != null) {
                handleNotificationFailure(notification, tenantId, e.getMessage());
            }
        } finally {
            TenantContext.clear();
        }
    }

    private void handleNotificationFailure(Notification notification, String tenantId, String error) {
        int retries = notification.getRetryCount() + 1;
        notification.setRetryCount(retries);
        notification.setErrorMessage(error);

        if (retries < 3) {
            notification.setStatus("RETRYING");
            log.warn("Notification ID '{}' failed. Scheduled for retry ({}/3)", notification.getId(), retries);
        } else {
            notification.setStatus("FAILED");
            log.error("Notification ID '{}' FAILED permanently after 3 retries.", notification.getId());
        }
        notificationRepository.save(notification);

        EmailLog emailLog = EmailLog.builder()
                .tenantId(tenantId)
                .notification(notification)
                .providerName(emailProvider.getProviderName())
                .recipientEmail(notification.getRecipientEmail())
                .status("FAILED")
                .responsePayload("Error: " + error)
                .build();
        emailLogRepository.save(emailLog);
    }

    @Override
    @Async
    @Transactional
    public void processPendingNotificationsAsync() {
        String tenantId = TenantContext.getTenantId();
        List<Notification> pendingList = notificationRepository.findByTenantIdAndStatusIn(tenantId, List.of("PENDING", "RETRYING"));
        log.info("Processing {} pending/retrying notifications asynchronously", pendingList.size());
        for (Notification n : pendingList) {
            dispatchNotificationAsync(n.getId(), tenantId);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotifications(String status, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        if (status != null && !status.isBlank()) {
            return notificationRepository.findByTenantIdAndStatus(tenantId, status.toUpperCase(), pageable).map(this::mapToResponse);
        }
        return notificationRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public AnnouncementResponse createAnnouncement(String currentUserId, AnnouncementCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        User user = userRepository.findById(currentUserId).orElse(null);

        Announcement announcement = Announcement.builder()
                .tenantId(tenantId)
                .event(event)
                .title(request.getTitle())
                .message(request.getMessage())
                .category(request.getCategory() != null ? request.getCategory().toUpperCase() : "GENERAL")
                .postedBy(user)
                .build();

        Announcement saved = announcementRepository.save(announcement);
        return mapToAnnouncementResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementResponse> getAnnouncementsByEvent(String eventId, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return announcementRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, pageable).map(this::mapToAnnouncementResponse);
    }

    @Override
    @Async
    @Transactional
    public void sendEmergencyNotification(String eventId, String title, String message) {
        String tenantId = TenantContext.getTenantId();
        log.info("DISPATCHING EMERGENCY NOTIFICATION FOR EVENT '{}'", eventId);

        List<Registration> attendees = registrationRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, Pageable.unpaged()).getContent();

        for (Registration reg : attendees) {
            NotificationSendRequest req = NotificationSendRequest.builder()
                    .eventId(eventId)
                    .recipientEmail(reg.getAttendeeEmail())
                    .recipientName(reg.getAttendeeName())
                    .subject("[EMERGENCY ALERT] " + title)
                    .content(message)
                    .type("EMERGENCY")
                    .build();
            sendNotification(req);
        }
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .eventId(n.getEvent() != null ? n.getEvent().getId() : null)
                .recipientEmail(n.getRecipientEmail())
                .recipientName(n.getRecipientName())
                .subject(n.getSubject())
                .type(n.getType())
                .status(n.getStatus())
                .retryCount(n.getRetryCount())
                .sentAt(n.getSentAt())
                .errorMessage(n.getErrorMessage())
                .createdAt(n.getCreatedAt())
                .build();
    }

    private AnnouncementResponse mapToAnnouncementResponse(Announcement a) {
        return AnnouncementResponse.builder()
                .id(a.getId())
                .eventId(a.getEvent().getId())
                .title(a.getTitle())
                .message(a.getMessage())
                .category(a.getCategory())
                .postedByEmail(a.getPostedBy() != null ? a.getPostedBy().getEmail() : "SYSTEM")
                .createdAt(a.getCreatedAt())
                .build();
    }
}
