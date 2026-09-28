package com.eventsphere.qr.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrValidationResult {
    private boolean valid;
    private String message;
    private String ticketId;
    private String registrationId;
    private String eventId;
    private String tenantId;
    private String attendeeName;
    private String attendeeEmail;
    private String ticketTypeName;
    private Instant scannedAt;
}
