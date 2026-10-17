package com.eventsphere.notification.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.notification.dto.*;
import com.eventsphere.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "SEND_NOTIFICATION", entityType = "NOTIFICATION")
    public ResponseEntity<ApiResponse<NotificationResponse>> sendNotification(@Valid @RequestBody NotificationSendRequest request) {
        NotificationResponse response = notificationService.sendNotification(request);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(ApiResponse.success("Notification queued for asynchronous delivery", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<PagedResponse<NotificationResponse>> getNotifications(
            @RequestParam(value = "status", required = false) String status,
            Pageable pageable) {
        Page<NotificationResponse> page = notificationService.getNotifications(status, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Notifications retrieved successfully"));
    }

    @PostMapping("/announcements")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CREATE_ANNOUNCEMENT", entityType = "ANNOUNCEMENT")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> createAnnouncement(@Valid @RequestBody AnnouncementCreateRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        AnnouncementResponse response = notificationService.createAnnouncement(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Announcement published successfully", response));
    }

    @GetMapping("/announcements/event/{eventId}")
    public ResponseEntity<PagedResponse<AnnouncementResponse>> getAnnouncementsByEvent(@PathVariable("eventId") String eventId, Pageable pageable) {
        Page<AnnouncementResponse> page = notificationService.getAnnouncementsByEvent(eventId, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Announcements retrieved successfully"));
    }

    @PostMapping("/emergency/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "SEND_EMERGENCY_NOTIFICATION", entityType = "NOTIFICATION")
    public ResponseEntity<ApiResponse<Void>> sendEmergencyNotification(
            @PathVariable("eventId") String eventId,
            @RequestParam("title") String title,
            @RequestParam("message") String message) {
        notificationService.sendEmergencyNotification(eventId, title, message);
        return ResponseEntity.accepted()
                .body(ApiResponse.success("Emergency notification broadcast initiated", null));
    }
}
