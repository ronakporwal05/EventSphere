package com.eventsphere.session.dto;

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
public class SessionResponse {
    private String id;
    private String eventId;
    private String roomId;
    private String roomName;
    private String title;
    private String description;
    private Instant startTime;
    private Instant endTime;
    private int capacity;
    private String status;
    private Set<String> speakerUserIds;
    private Instant createdAt;
}
