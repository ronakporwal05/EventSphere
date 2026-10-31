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
public class NoShowPredictionResponse {
    private String eventId;
    private int totalRegistrations;
    private int expectedAttendees;
    private int expectedNoShows;
    private double averageNoShowProbability;
    private int highRiskCount;
    private Map<String, Integer> riskBreakdown;
    private List<String> topFactors;
    private List<String> reminderStrategies;
    private String modelName;
    private String safetyNotice;
}
