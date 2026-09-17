package com.eventsphere.session.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionCreateRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "Session title is required")
    private String title;

    private String description;
    private String roomId;

    @NotNull(message = "Start time is required")
    private Instant startTime;

    @NotNull(message = "End time is required")
    private Instant endTime;

    private int capacity;
    private Set<String> speakerUserIds;
}
