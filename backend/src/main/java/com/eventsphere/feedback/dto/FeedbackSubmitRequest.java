package com.eventsphere.feedback.dto;

import jakarta.validation.constraints.Max;
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
public class FeedbackSubmitRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    private String registrationId;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private int rating;

    private String category; // GENERAL, VENUE, SPEAKERS, FOOD, ORGANIZING

    @NotBlank(message = "Comment is required")
    private String comment;
}
