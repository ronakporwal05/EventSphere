package com.eventsphere.session.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpeakerAssignRequest {

    @NotEmpty(message = "At least one speaker user ID is required")
    private Set<String> speakerUserIds;
}
