package com.eventsphere.team.dto;

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
public class TeamResponse {
    private String id;
    private String eventId;
    private String name;
    private String code;
    private String leaderUserId;
    private String leaderEmail;
    private int minTeamSize;
    private int maxTeamSize;
    private String status;
    private List<TeamMemberResponse> members;
    private Instant createdAt;
}
