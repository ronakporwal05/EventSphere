package com.eventsphere.admin.ai.service;

import com.eventsphere.admin.ai.dto.*;
import com.eventsphere.admin.ai.entity.AiModelConfig;
import com.eventsphere.admin.ai.entity.AiTokenUsageLog;
import com.eventsphere.admin.ai.repository.AiModelConfigRepository;
import com.eventsphere.admin.ai.repository.AiTokenUsageLogRepository;
import com.eventsphere.common.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiAdministrationServiceImpl implements AiAdministrationService {

    private final AiModelConfigRepository configRepository;
    private final AiTokenUsageLogRepository tokenUsageLogRepository;

    @Override
    @Transactional
    public AiModelConfigResponse getTenantAiConfig() {
        String tenantId = TenantContext.getTenantId();
        AiModelConfig config = configRepository.findByTenantId(tenantId)
                .orElseGet(() -> createDefaultConfig(tenantId));
        return mapToConfigResponse(config);
    }

    @Override
    @Transactional
    public AiModelConfigResponse updateTenantAiConfig(AiModelConfigRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Updating AI Model Config for tenant '{}'", tenantId);

        AiModelConfig config = configRepository.findByTenantId(tenantId)
                .orElseGet(() -> createDefaultConfig(tenantId));

        if (request.getLlmProvider() != null) config.setLlmProvider(request.getLlmProvider());
        if (request.getEmbeddingProvider() != null) config.setEmbeddingProvider(request.getEmbeddingProvider());
        if (request.getTemperature() != null) config.setTemperature(request.getTemperature());
        if (request.getTopP() != null) config.setTopP(request.getTopP());
        if (request.getMaxOutputTokens() != null) config.setMaxOutputTokens(request.getMaxOutputTokens());
        if (request.getDailyTokenQuota() != null) config.setDailyTokenQuota(request.getDailyTokenQuota());
        if (request.getMonthlyTokenQuota() != null) config.setMonthlyTokenQuota(request.getMonthlyTokenQuota());

        if (request.getFeatureRagEnabled() != null) config.setFeatureRagEnabled(request.getFeatureRagEnabled());
        if (request.getFeatureAssistantEnabled() != null) config.setFeatureAssistantEnabled(request.getFeatureAssistantEnabled());
        if (request.getFeatureAnalyticsEnabled() != null) config.setFeatureAnalyticsEnabled(request.getFeatureAnalyticsEnabled());
        if (request.getFeatureContentStudioEnabled() != null) config.setFeatureContentStudioEnabled(request.getFeatureContentStudioEnabled());

        AiModelConfig updated = configRepository.save(config);
        return mapToConfigResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public AiMetricsOverview getTenantAiMetrics() {
        String tenantId = TenantContext.getTenantId();
        AiModelConfig config = configRepository.findByTenantId(tenantId)
                .orElseGet(() -> createDefaultConfig(tenantId));

        Long totalTokens = tokenUsageLogRepository.sumTotalTokensByTenantId(tenantId);
        Double totalCost = tokenUsageLogRepository.sumEstimatedCostByTenantId(tenantId);

        long used = totalTokens != null ? totalTokens : 0L;
        double cost = totalCost != null ? totalCost : 0.0;

        int dailyRemaining = Math.max(0, config.getDailyTokenQuota() - (int) Math.min(config.getDailyTokenQuota(), used));
        int monthlyRemaining = Math.max(0, config.getMonthlyTokenQuota() - (int) Math.min(config.getMonthlyTokenQuota(), used));

        double consumptionPct = config.getMonthlyTokenQuota() > 0 ?
                Math.round(((double) used / config.getMonthlyTokenQuota() * 100.0) * 10.0) / 10.0 : 0.0;

        return AiMetricsOverview.builder()
                .tenantId(tenantId)
                .totalTokensUsed(used)
                .totalEstimatedCostUsd(Math.round(cost * 10000.0) / 10000.0)
                .dailyQuotaRemaining(dailyRemaining)
                .monthlyQuotaRemaining(monthlyRemaining)
                .quotaConsumptionPercentage(consumptionPct)
                .build();
    }

    @Override
    @Transactional
    public void recordTokenUsage(String moduleName, int promptTokens, int completionTokens) {
        String tenantId = TenantContext.getTenantId();
        int total = promptTokens + completionTokens;

        // Estimated cost metric ($0.000002 per token baseline)
        double estimatedCost = total * 0.000002;

        AiTokenUsageLog logEntry = AiTokenUsageLog.builder()
                .tenantId(tenantId)
                .moduleName(moduleName)
                .promptTokens(promptTokens)
                .completionTokens(completionTokens)
                .totalTokens(total)
                .estimatedCostUsd(estimatedCost)
                .build();

        tokenUsageLogRepository.save(logEntry);
        log.debug("Logged AI Token Usage for tenant '{}' | Module: {} | Tokens: {} | Cost: ${}", tenantId, moduleName, total, estimatedCost);
    }

    private AiModelConfig createDefaultConfig(String tenantId) {
        AiModelConfig config = AiModelConfig.builder()
                .tenantId(tenantId)
                .llmProvider("GEMINI_1_5_PRO")
                .embeddingProvider("GEMINI_EMBEDDING_004")
                .temperature(0.7)
                .topP(0.9)
                .maxOutputTokens(2048)
                .dailyTokenQuota(500000)
                .monthlyTokenQuota(15000000)
                .featureRagEnabled(true)
                .featureAssistantEnabled(true)
                .featureAnalyticsEnabled(true)
                .featureContentStudioEnabled(true)
                .build();
        return configRepository.save(config);
    }

    private AiModelConfigResponse mapToConfigResponse(AiModelConfig c) {
        return AiModelConfigResponse.builder()
                .id(c.getId())
                .tenantId(c.getTenantId())
                .llmProvider(c.getLlmProvider())
                .embeddingProvider(c.getEmbeddingProvider())
                .temperature(c.getTemperature())
                .topP(c.getTopP())
                .maxOutputTokens(c.getMaxOutputTokens())
                .dailyTokenQuota(c.getDailyTokenQuota())
                .monthlyTokenQuota(c.getMonthlyTokenQuota())
                .featureRagEnabled(c.isFeatureRagEnabled())
                .featureAssistantEnabled(c.isFeatureAssistantEnabled())
                .featureAnalyticsEnabled(c.isFeatureAnalyticsEnabled())
                .featureContentStudioEnabled(c.isFeatureContentStudioEnabled())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
