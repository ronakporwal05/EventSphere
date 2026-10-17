package com.eventsphere.volunteer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftCreateRequest {

    @NotBlank(message = "Volunteer ID is required")
    private String volunteerId;

    @NotBlank(message = "Shift name is required")
    private String shiftName;

    @NotNull(message = "Start time is required")
    private Instant startTime;

    @NotNull(message = "End time is required")
    private Instant endTime;

    private String location;
}
