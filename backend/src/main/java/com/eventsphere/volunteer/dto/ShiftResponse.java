package com.eventsphere.volunteer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftResponse {
    private String id;
    private String volunteerId;
    private String shiftName;
    private Instant startTime;
    private Instant endTime;
    private String location;
    private String status;
    private Instant createdAt;
}
