package com.eventsphere.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionRecommendation {
    private String sessionId;
    private String sessionTitle;
    private String track;
    private double matchScore;
    private String recommendationReason;
}
