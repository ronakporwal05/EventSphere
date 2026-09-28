package com.eventsphere.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketGenerateRequest {

    @NotBlank(message = "Registration ID is required")
    private String registrationId;

    @NotBlank(message = "Ticket Type ID is required")
    private String ticketTypeId;

    private Instant expiresAt;
}
