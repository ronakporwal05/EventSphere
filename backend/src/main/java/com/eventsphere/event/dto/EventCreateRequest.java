package com.eventsphere.event.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventCreateRequest {

    @NotBlank(message = "Event title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    private String slug;

    private String shortDescription;
    private String description;
    private String bannerUrl;
    private String logoUrl;

    @NotBlank(message = "Category is required")
    private String category;

    @Builder.Default
    private String eventType = "HYBRID";

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    private Instant registrationStart;
    private Instant registrationEnd;

    @NotNull(message = "Start date is required")
    private Instant startDate;

    @NotNull(message = "End date is required")
    private Instant endDate;

    private String venueId;
    private boolean isPublic;
    private boolean requireApproval;

    private List<EventCustomFieldDTO> customFields;
}
