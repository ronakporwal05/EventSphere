package com.eventsphere.intelligence.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.intelligence.dto.*;
import com.eventsphere.intelligence.service.EventIntelligenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/intelligence")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class EventIntelligenceController {

    private final EventIntelligenceService intelligenceService;

    @PostMapping("/proposals")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "UPLOAD_PROPOSAL", entityType = "PROPOSAL")
    public ResponseEntity<ApiResponse<ProposalResponse>> uploadProposal(
            @Valid @RequestBody ProposalUploadRequest request) {
        ProposalResponse response = intelligenceService.uploadAndAnalyzeProposal(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event proposal uploaded and milestones extracted successfully", response));
    }

    @GetMapping("/proposals/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ProposalResponse>> getProposal(@PathVariable("id") String id) {
        ProposalResponse response = intelligenceService.getProposal(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/events/{eventId}/proposals")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ProposalResponse>>> getProposalsByEvent(@PathVariable("eventId") String eventId) {
        List<ProposalResponse> response = intelligenceService.getProposalsByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/proposals/{id}/approve")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "APPROVE_MILESTONES", entityType = "PROPOSAL")
    public ResponseEntity<ApiResponse<ProposalResponse>> approveMilestones(
            @PathVariable("id") String id,
            @RequestBody MilestoneApprovalRequest request) {
        ProposalResponse response = intelligenceService.approveMilestones(id, request);
        return ResponseEntity.ok(ApiResponse.success("Milestones approved and integrated into checklist", response));
    }

    @GetMapping("/events/{eventId}/progress")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EventProgressResponse>> getProgress(@PathVariable("eventId") String eventId) {
        EventProgressResponse response = intelligenceService.calculateProgress(eventId);
        return ResponseEntity.ok(ApiResponse.success("Deterministic progress calculated successfully", response));
    }

    @GetMapping("/events/{eventId}/delay-prediction")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DelayPredictionResponse>> predictDelayRisk(@PathVariable("eventId") String eventId) {
        DelayPredictionResponse response = intelligenceService.predictDelayRisk(eventId);
        return ResponseEntity.ok(ApiResponse.success("Event delay risk predicted successfully", response));
    }

    @GetMapping("/events/{eventId}/registration-forecast")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<RegistrationForecastResponse>> forecastRegistrations(@PathVariable("eventId") String eventId) {
        RegistrationForecastResponse response = intelligenceService.forecastRegistrations(eventId);
        return ResponseEntity.ok(ApiResponse.success("Registration forecast generated successfully", response));
    }

    @GetMapping("/events/{eventId}/noshow-prediction")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<NoShowPredictionResponse>> predictNoShows(@PathVariable("eventId") String eventId) {
        NoShowPredictionResponse response = intelligenceService.predictNoShows(eventId);
        return ResponseEntity.ok(ApiResponse.success("Attendee no-show probability calculated successfully", response));
    }

    @GetMapping("/events/{eventId}/anomalies")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AnomalyDetectionResponse>> detectAnomalies(@PathVariable("eventId") String eventId) {
        AnomalyDetectionResponse response = intelligenceService.detectAnomalies(eventId);
        return ResponseEntity.ok(ApiResponse.success("Ticket fraud and anomaly detection complete", response));
    }

    @GetMapping("/events/{eventId}/crowd-prediction")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SessionCrowdResponse>> predictSessionCrowds(@PathVariable("eventId") String eventId) {
        SessionCrowdResponse response = intelligenceService.predictSessionCrowds(eventId);
        return ResponseEntity.ok(ApiResponse.success("Session attendance and crowd forecast calculated", response));
    }

    @GetMapping("/events/{eventId}/dynamic-pricing")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DynamicPricingResponse>> calculateDynamicPricing(@PathVariable("eventId") String eventId) {
        DynamicPricingResponse response = intelligenceService.calculateDynamicPricing(eventId);
        return ResponseEntity.ok(ApiResponse.success("Dynamic pricing and yield optimization calculated successfully", response));
    }

    @PostMapping("/events/{eventId}/dynamic-pricing/apply")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "APPLY_DYNAMIC_PRICING", entityType = "EVENT")
    public ResponseEntity<ApiResponse<DynamicPricingResponse>> applyOptimalPrice(
            @PathVariable("eventId") String eventId,
            @RequestParam(name = "newPrice", required = false) Double newPrice) {
        DynamicPricingResponse response = intelligenceService.applyOptimalPrice(eventId, newPrice != null ? newPrice : 1699.0);
        return ResponseEntity.ok(ApiResponse.success("Optimal dynamic price applied to ticket gateway", response));
    }

    @GetMapping("/events/{eventId}/dashboard")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<IntelligenceDashboardResponse>> getDashboardIntelligence(@PathVariable("eventId") String eventId) {
        IntelligenceDashboardResponse response = intelligenceService.getDashboardIntelligence(eventId);
        return ResponseEntity.ok(ApiResponse.success("Event intelligence dashboard synthesized successfully", response));
    }
}
