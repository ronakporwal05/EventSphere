package com.eventsphere.team.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberResponse {
    private String id;
    private String userId;
    private String userEmail;
    private String userName;
    private String role;
    private String status;
    private Instant joinedAt;
}
