package com.eventsphere.volunteer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerApplyRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    private String preferredRole; // SCANNER, INFO_DESK, LOGISTICS, VIP_ESCORT
}
