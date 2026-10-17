package com.eventsphere.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private String id;
    private String eventId;
    private String recipientEmail;
    private String recipientName;
    private String subject;
    private String type;
    private String status;
    private int retryCount;
    private Instant sentAt;
    private String errorMessage;
    private Instant createdAt;
}
