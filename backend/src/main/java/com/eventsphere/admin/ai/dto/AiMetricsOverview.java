package com.eventsphere.admin.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiMetricsOverview {
    private String tenantId;
    private long totalTokensUsed;
    private double totalEstimatedCostUsd;
    private int dailyQuotaRemaining;
    private int monthlyQuotaRemaining;
    private double quotaConsumptionPercentage;
}
