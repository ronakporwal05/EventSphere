package com.eventsphere.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkCheckInRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotEmpty(message = "Ticket numbers list cannot be empty")
    private List<String> ticketNumbers;

    private String notes;
}
