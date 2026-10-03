package com.eventsphere.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckInRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    private String ticketId;

    private String ticketNumber;

    private String qrToken;

    private String checkInMethod; // QR_SCAN, MANUAL, BULK

    private String notes;
}
