package com.eventsphere.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DynamicPricingRequest {
    private String eventId;
    private Double currentPrice;
    private Integer targetCapacity;
    private Integer currentSales;
    private Integer daysRemaining;
    private Double dailyVelocity;
    private String category;
}
