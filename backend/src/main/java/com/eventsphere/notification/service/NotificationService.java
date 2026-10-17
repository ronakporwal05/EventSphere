package com.eventsphere.notification.service;

import com.eventsphere.notification.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {

    NotificationResponse sendNotification(NotificationSendRequest request);

    void processPendingNotificationsAsync();

    Page<NotificationResponse> getNotifications(String status, Pageable pageable);

    AnnouncementResponse createAnnouncement(String currentUserId, AnnouncementCreateRequest request);

    Page<AnnouncementResponse> getAnnouncementsByEvent(String eventId, Pageable pageable);

    void sendEmergencyNotification(String eventId, String title, String message);
}
