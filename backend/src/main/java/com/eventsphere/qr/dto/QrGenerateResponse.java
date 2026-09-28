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
public class QrGenerateResponse {
    private String ticketId;
    private String ticketNumber;
    private String qrToken;
    private Instant expiresAt;
}
