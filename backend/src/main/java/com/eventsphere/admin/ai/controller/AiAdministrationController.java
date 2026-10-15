package com.eventsphere.admin.ai.controller;

import com.eventsphere.admin.ai.dto.*;
import com.eventsphere.admin.ai.service.AiAdministrationService;
import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/ai")
@RequiredArgsConstructor
public class AiAdministrationController {

    private final AiAdministrationService aiAdminService;

    @GetMapping("/config")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN')")
    public ResponseEntity<ApiResponse<AiModelConfigResponse>> getTenantAiConfig() {
        AiModelConfigResponse config = aiAdminService.getTenantAiConfig();
        return ResponseEntity.ok(ApiResponse.success(config));
    }

    @PutMapping("/config")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN')")
    @Auditable(action = "UPDATE_AI_MODEL_CONFIG", entityType = "AI_MODEL_CONFIG")
    public ResponseEntity<ApiResponse<AiModelConfigResponse>> updateTenantAiConfig(@Valid @RequestBody AiModelConfigRequest request) {
        AiModelConfigResponse updated = aiAdminService.updateTenantAiConfig(request);
        return ResponseEntity.ok(ApiResponse.success("Tenant AI Configuration updated successfully", updated));
    }

    @GetMapping("/metrics")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN')")
    public ResponseEntity<ApiResponse<AiMetricsOverview>> getTenantAiMetrics() {
        AiMetricsOverview metrics = aiAdminService.getTenantAiMetrics();
        return ResponseEntity.ok(ApiResponse.success("AI usage metrics retrieved", metrics));
    }
}
