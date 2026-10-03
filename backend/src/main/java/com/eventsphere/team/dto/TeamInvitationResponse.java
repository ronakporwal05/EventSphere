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
public class TeamInvitationResponse {
    private String id;
    private String teamId;
    private String teamName;
    private String inviteeEmail;
    private String invitedByEmail;
    private String token;
    private String status;
    private Instant expiresAt;
    private Instant createdAt;
}
