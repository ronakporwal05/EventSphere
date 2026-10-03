package com.eventsphere.team.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamCreateRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "Team name is required")
    private String name;

    @Min(value = 1, message = "Minimum team size must be at least 1")
    private int minTeamSize;

    @Min(value = 1, message = "Maximum team size must be at least 1")
    private int maxTeamSize;
}
