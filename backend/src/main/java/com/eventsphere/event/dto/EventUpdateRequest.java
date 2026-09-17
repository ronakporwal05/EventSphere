package com.eventsphere.event.dto;

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
public class EventUpdateRequest {

    private String title;
    private String shortDescription;
    private String description;
    private String bannerUrl;
    private String logoUrl;
    private String category;
    private String eventType;
    private Integer capacity;
    private Instant registrationStart;
    private Instant registrationEnd;
    private Instant startDate;
    private Instant endDate;
    private String venueId;
    private Boolean isPublic;
    private Boolean requireApproval;
    private List<EventCustomFieldDTO> customFields;
}
