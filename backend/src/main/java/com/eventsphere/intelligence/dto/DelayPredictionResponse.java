package com.eventsphere.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DelayPredictionResponse {
    private String eventId;
    private double delayProbability;
    private boolean willMissDeadline;
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private double confidence;
    private List<Map<String, Object>> riskFactors;
    private List<String> correctiveActions;
    private String modelName;
    private String baselineComparison;
    private String trainingDataNote;
}
