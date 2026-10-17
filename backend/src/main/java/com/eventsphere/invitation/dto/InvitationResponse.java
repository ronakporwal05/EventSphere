package com.eventsphere.invitation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationResponse {
    private String id;
    private String tenantId;
    private String email;
    private String roleName;
    private String department;
    private String status;
    private String invitedByEmail;
    private Instant expiresAt;
    private Instant createdAt;
}
