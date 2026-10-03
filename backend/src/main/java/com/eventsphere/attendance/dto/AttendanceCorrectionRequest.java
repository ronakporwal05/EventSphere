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
public class AttendanceCorrectionRequest {

    @NotBlank(message = "Status is required (CHECKED_IN, CHECKED_OUT, CORRECTION_REMOVED)")
    private String status;

    private String notes;
}
