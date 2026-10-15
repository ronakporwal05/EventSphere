package com.eventsphere.analytics.controller;

import com.eventsphere.analytics.dto.*;
import com.eventsphere.analytics.service.AiAnalyticsService;
import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai-analytics")
@RequiredArgsConstructor
public class AiAnalyticsController {

    private final AiAnalyticsService analyticsService;

    @GetMapping("/predictive/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<ApiResponse<AiAnalyticsInsights>> generateEventPredictiveAnalytics(@PathVariable("eventId") String eventId) {
        AiAnalyticsInsights insights = analyticsService.generateEventPredictiveAnalytics(eventId);
        return ResponseEntity.ok(ApiResponse.success("Predictive analytics computed successfully", insights));
    }

    @PostMapping("/query")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "AI_ANALYTICS_QUERY", entityType = "ANALYTICS_QUERY")
    public ResponseEntity<ApiResponse<NaturalLanguageAnalyticsQueryResponse>> queryAnalytics(@Valid @RequestBody NaturalLanguageAnalyticsQueryRequest request) {
        NaturalLanguageAnalyticsQueryResponse response = analyticsService.queryAnalytics(request);
        return ResponseEntity.ok(ApiResponse.success("Analytics query processed", response));
    }
}
