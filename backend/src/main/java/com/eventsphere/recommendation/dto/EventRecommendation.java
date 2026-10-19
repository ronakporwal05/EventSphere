package com.eventsphere.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRecommendation {
    private String eventId;
    private String eventTitle;
    private String category;
    private double matchScore;
    private String recommendationReason;
}
