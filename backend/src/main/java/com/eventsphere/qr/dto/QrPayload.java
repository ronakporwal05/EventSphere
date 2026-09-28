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
public class QrPayload {
    private String ticketId;
    private String registrationId;
    private String eventId;
    private String tenantId;
    private Instant issuedAt;
    private Instant expiresAt;
    private String nonce;
}
