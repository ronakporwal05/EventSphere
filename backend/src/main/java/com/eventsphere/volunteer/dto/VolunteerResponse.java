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
public class VolunteerResponse {
    private String id;
    private String eventId;
    private String userId;
    private String userName;
    private String userEmail;
    private String assignedRole;
    private String status;
    private boolean scannerModeEnabled;
    private Instant createdAt;
}
