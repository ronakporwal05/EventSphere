package com.eventsphere.timeline.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelineResponse {
    private String id;
    private String eventId;
    private String title;
    private String description;
    private Instant milestoneDate;
    private String status;
    private int displayOrder;
    private Instant createdAt;
}
