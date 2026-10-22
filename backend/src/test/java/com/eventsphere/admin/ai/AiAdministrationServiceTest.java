package com.eventsphere.admin.ai;

import com.eventsphere.admin.ai.dto.AiMetricsOverview;
import com.eventsphere.admin.ai.dto.AiModelConfigRequest;
import com.eventsphere.admin.ai.dto.AiModelConfigResponse;
import com.eventsphere.admin.ai.entity.AiModelConfig;
import com.eventsphere.admin.ai.repository.AiModelConfigRepository;
import com.eventsphere.admin.ai.repository.AiTokenUsageLogRepository;
import com.eventsphere.admin.ai.service.AiAdministrationServiceImpl;
import com.eventsphere.common.tenant.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiAdministrationServiceTest {

    @Mock
    private AiModelConfigRepository configRepository;
    @Mock
    private AiTokenUsageLogRepository tokenUsageLogRepository;

    @InjectMocks
    private AiAdministrationServiceImpl aiAdminService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-adm-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testGetTenantAiConfigDefaultCreation() {
        when(configRepository.findByTenantId("tenant-adm-1")).thenReturn(Optional.empty());
        when(configRepository.save(any(AiModelConfig.class))).thenAnswer(i -> {
            AiModelConfig c = i.getArgument(0);
            c.setId("cfg-100");
            return c;
        });

        AiModelConfigResponse response = aiAdminService.getTenantAiConfig();

        assertNotNull(response);
        assertEquals("cfg-100", response.getId());
        assertEquals("GEMINI_1_5_PRO", response.getLlmProvider());
        assertTrue(response.isFeatureRagEnabled());
    }

    @Test
    void testUpdateTenantAiConfigSuccess() {
        AiModelConfig existing = AiModelConfig.builder().id("cfg-100").tenantId("tenant-adm-1").temperature(0.7).featureRagEnabled(true).build();
        when(configRepository.findByTenantId("tenant-adm-1")).thenReturn(Optional.of(existing));
        when(configRepository.save(any(AiModelConfig.class))).thenAnswer(i -> i.getArgument(0));

        AiModelConfigRequest request = AiModelConfigRequest.builder()
                .temperature(0.2)
                .featureRagEnabled(false)
                .build();

        AiModelConfigResponse response = aiAdminService.updateTenantAiConfig(request);

        assertNotNull(response);
        assertEquals(0.2, response.getTemperature());
        assertFalse(response.isFeatureRagEnabled());
    }

    @Test
    void testGetTenantAiMetricsSuccess() {
        AiModelConfig config = AiModelConfig.builder().tenantId("tenant-adm-1").monthlyTokenQuota(1000000).build();
        when(configRepository.findByTenantId("tenant-adm-1")).thenReturn(Optional.of(config));
        when(tokenUsageLogRepository.sumTotalTokensByTenantId("tenant-adm-1")).thenReturn(250000L);
        when(tokenUsageLogRepository.sumEstimatedCostByTenantId("tenant-adm-1")).thenReturn(0.50);

        AiMetricsOverview metrics = aiAdminService.getTenantAiMetrics();

        assertNotNull(metrics);
        assertEquals(250000L, metrics.getTotalTokensUsed());
        assertEquals(0.50, metrics.getTotalEstimatedCostUsd());
        assertEquals(25.0, metrics.getQuotaConsumptionPercentage());
    }
}
