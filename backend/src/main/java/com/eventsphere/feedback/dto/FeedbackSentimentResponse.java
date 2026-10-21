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
public class FeedbackSentimentResponse {
    private String eventId;
    private String eventTitle;
    private int totalFeedbackCount;
    private double averageRating;
    private int positiveCount;
    private int neutralCount;
    private int negativeCount;
    private String topThemes;
    private String actionItems;
    private Instant calculatedAt;
}
