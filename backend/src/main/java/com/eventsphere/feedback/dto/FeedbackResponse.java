package com.eventsphere.feedback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {
    private String id;
    private String eventId;
    private int rating;
    private String category;
    private String comment;
    private String sentiment;
    private String emotion;
    private Instant createdAt;
}
