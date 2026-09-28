package com.eventsphere.ticket.dto;

import com.eventsphere.ticket.entity.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private String id;
    private String eventId;
    private String eventTitle;
    private String registrationId;
    private String registrationNumber;
    private String attendeeName;
    private String attendeeEmail;
    private String ticketTypeId;
    private String ticketTypeName;
    private BigDecimal ticketPrice;
    private String ticketNumber;
    private TicketStatus status;
    private Instant issuedAt;
    private Instant expiresAt;
    private String revocationReason;
    private Instant createdAt;
}
