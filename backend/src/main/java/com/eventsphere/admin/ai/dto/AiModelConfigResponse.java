package com.eventsphere.admin.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiModelConfigResponse {
    private String id;
    private String tenantId;
    private String llmProvider;
    private String embeddingProvider;
    private double temperature;
    private double topP;
    private int maxOutputTokens;
    private int dailyTokenQuota;
    private int monthlyTokenQuota;
    private boolean featureRagEnabled;
    private boolean featureAssistantEnabled;
    private boolean featureAnalyticsEnabled;
    private boolean featureContentStudioEnabled;
    private Instant updatedAt;
}
