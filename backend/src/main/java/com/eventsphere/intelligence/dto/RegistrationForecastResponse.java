package com.eventsphere.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationForecastResponse {
    private String eventId;
    private int currentRegistrations;
    private int targetCapacity;
    private int predictedFinalRegistrations;
    private int lowerBound;
    private int upperBound;
    private double riskOfMissingTarget; // 0.0 to 1.0
    private double registrationVelocityPerDay;
    private long daysRemaining;
    private int baselineLinearEstimate;
    private String modelName;
    private String note;
}
