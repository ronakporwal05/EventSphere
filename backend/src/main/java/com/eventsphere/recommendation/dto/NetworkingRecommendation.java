package com.eventsphere.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NetworkingRecommendation {
    private String recommendedUserId;
    private String recommendedUserName;
    private String organization;
    private double matchScore;
    private String sharedInterests;
}
