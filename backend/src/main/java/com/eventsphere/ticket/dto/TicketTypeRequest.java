package com.eventsphere.ticket.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketTypeRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "Ticket type name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal price;

    private String currency;

    @Min(value = 1, message = "Total quantity must be at least 1")
    private int totalQuantity;
}
