package com.eventsphere.team.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamInviteRequest {

    @NotBlank(message = "Team ID is required")
    private String teamId;

    @NotBlank(message = "Invitee email is required")
    @Email(message = "Invalid email format")
    private String inviteeEmail;
}
