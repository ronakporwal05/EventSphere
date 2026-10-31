package com.eventsphere.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntelligenceDashboardResponse {
    private String eventId;
    private String eventTitle;
    private EventProgressResponse progress;
    private DelayPredictionResponse delayPrediction;
    private RegistrationForecastResponse registrationForecast;
    private NoShowPredictionResponse noShowPrediction;
    private AnomalyDetectionResponse anomalyDetection;
    private SessionCrowdResponse sessionCrowd;
    private List<ProposalResponse> proposals;
}
