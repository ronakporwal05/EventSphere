package com.eventsphere.ticket.dto;

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
public class TicketTypeResponse {
    private String id;
    private String eventId;
    private String name;
    private String description;
    private BigDecimal price;
    private String currency;
    private int totalQuantity;
    private int availableQuantity;
    private boolean active;
    private Instant createdAt;
}
