package com.eventsphere.pricing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DynamicPricingRecommendation {
    private String eventId;
    private String eventTitle;
    private BigDecimal basePrice;
    private BigDecimal recommendedPrice;
    private double surgeMultiplier;
    private String demandState; // HIGH_VELOCITY, STEADY, LOW_DEMAND
    private double salesVelocityPerHour;
    private int remainingCapacity;
    private int totalCapacity;
    private double capacityUtilizationPercentage;
    private String aiReasoning;
    private List<String> optimizationSuggestions;
}
