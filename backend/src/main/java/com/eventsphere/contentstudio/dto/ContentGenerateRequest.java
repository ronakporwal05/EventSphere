package com.eventsphere.contentstudio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentGenerateRequest {

    private String eventId;

    @NotBlank(message = "Content type is required (MARKETING_COPY, SOCIAL_POST, SPEAKER_BIO, SESSION_DESC)")
    private String contentType;

    private String platform; // LINKEDIN, TWITTER, INSTAGRAM, EMAIL, LANDING_PAGE

    private String tone; // PROFESSIONAL, ENERGETIC, EXECUTIVE, CASUAL

    @NotBlank(message = "Prompt details are required")
    private String promptDetails;
}
