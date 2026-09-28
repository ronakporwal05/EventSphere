package com.eventsphere.capacity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WaitlistResponse {
    private String id;
    private String eventId;
    private String registrationId;
    private String attendeeName;
    private String attendeeEmail;
    private int position;
    private String status;
    private Instant createdAt;
    private Instant promotedAt;
}
