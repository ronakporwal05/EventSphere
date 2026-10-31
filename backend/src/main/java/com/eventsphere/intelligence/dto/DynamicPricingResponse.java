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
public class DynamicPricingResponse {
    private String eventId;
    private Double currentPrice;
    private Double optimalPrice;
    private Double priceDifferencePct;
    private String recommendedAction;
    private String rationale;
    private Double projectedGrossRevenue;
    private Double currentProjectedRevenue;
    private Double projectedRevenueUplift;
    private Integer expectedTotalSales;
    private Integer targetCapacity;
    private Double elasticityCoefficient;
    private Double demandSurgeFactor;
    private Double priceFloor;
    private Double priceCeiling;
    private List<PriceSimulationPoint> simulationCurve;
    private String algorithm;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceSimulationPoint {
        private Double price;
        private Integer projectedSales;
        private Double projectedRevenue;
        private Double selloutProbability;
    }
}
