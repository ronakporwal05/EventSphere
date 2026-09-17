package com.eventsphere.event.dto;

import com.eventsphere.event.entity.EventState;
import com.eventsphere.venue.dto.VenueResponse;
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
public class EventResponse {
    private String id;
    private String tenantId;
    private String title;
    private String slug;
    private String shortDescription;
    private String description;
    private String bannerUrl;
    private String logoUrl;
    private String category;
    private String eventType;
    private EventState status;
    private int capacity;
    private Instant registrationStart;
    private Instant registrationEnd;
    private Instant startDate;
    private Instant endDate;
    private VenueResponse venue;
    private boolean isPublic;
    private boolean requireApproval;
    private List<EventCustomFieldDTO> customFields;
    private Instant createdAt;
    private Instant updatedAt;
}
