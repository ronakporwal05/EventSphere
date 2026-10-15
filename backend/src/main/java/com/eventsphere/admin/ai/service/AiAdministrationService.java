package com.eventsphere.admin.ai.service;

import com.eventsphere.admin.ai.dto.*;

public interface AiAdministrationService {

    AiModelConfigResponse getTenantAiConfig();

    AiModelConfigResponse updateTenantAiConfig(AiModelConfigRequest request);

    AiMetricsOverview getTenantAiMetrics();

    void recordTokenUsage(String moduleName, int promptTokens, int completionTokens);
}
