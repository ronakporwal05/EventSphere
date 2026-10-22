package com.eventsphere.dashboard.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.dashboard.dto.LiveDashboardResponse;
import com.eventsphere.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/live/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<LiveDashboardResponse>> getLiveEventDashboard(@PathVariable("eventId") String eventId) {
        LiveDashboardResponse response = dashboardService.getLiveEventDashboard(eventId);
        return ResponseEntity.ok(ApiResponse.success("Live operations metrics retrieved successfully", response));
    }

    @PostMapping("/snapshots/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CAPTURE_DASHBOARD_SNAPSHOT", entityType = "DASHBOARD_SNAPSHOT")
    public ResponseEntity<ApiResponse<Void>> captureDashboardSnapshot(@PathVariable("eventId") String eventId) {
        dashboardService.captureDashboardSnapshot(eventId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard snapshot captured", null));
    }
}
