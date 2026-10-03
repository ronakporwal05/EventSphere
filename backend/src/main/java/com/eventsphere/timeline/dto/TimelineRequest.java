package com.eventsphere.timeline.dto;

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
public class TimelineRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "Milestone title is required")
    private String title;

    private String description;

    @NotNull(message = "Milestone date is required")
    private Instant milestoneDate;

    private String status;
    private int displayOrder;
}
