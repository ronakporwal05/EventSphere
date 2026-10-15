package com.eventsphere.admin.ai.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiModelConfigRequest {

    private String llmProvider;
    private String embeddingProvider;

    @Min(value = 0, message = "Temperature cannot be negative")
    @Max(value = 2, message = "Temperature cannot exceed 2.0")
    private Double temperature;

    private Double topP;
    private Integer maxOutputTokens;
    private Integer dailyTokenQuota;
    private Integer monthlyTokenQuota;

    private Boolean featureRagEnabled;
    private Boolean featureAssistantEnabled;
    private Boolean featureAnalyticsEnabled;
    private Boolean featureContentStudioEnabled;
}
