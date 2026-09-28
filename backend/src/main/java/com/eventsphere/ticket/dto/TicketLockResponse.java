package com.eventsphere.ticket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketLockResponse {
    private boolean locked;
    private String lockKey;
    private String ticketTypeId;
    private String ticketTypeName;
    private String userId;
    private long remainingSeconds;
    private Instant expiresAt;
    private String message;
}
