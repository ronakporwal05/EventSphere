package com.eventsphere.capacity.controller;

import com.eventsphere.capacity.dto.RegistrationDashboardResponse;
import com.eventsphere.capacity.dto.RegistrationStatsResponse;
import com.eventsphere.capacity.dto.WaitlistResponse;
import com.eventsphere.capacity.service.CapacityService;
import com.eventsphere.capacity.service.ExportService;
import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/capacity")
@RequiredArgsConstructor
public class CapacityController {

    private final CapacityService capacityService;
    private final ExportService exportService;

    @PostMapping("/waitlist/registration/{registrationId}")
    @Auditable(action = "ADD_TO_WAITLIST", entityType = "WAITLIST")
    public ResponseEntity<ApiResponse<WaitlistResponse>> addToWaitlist(@PathVariable("registrationId") String registrationId) {
        WaitlistResponse response = capacityService.addToWaitlist(registrationId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Added to waitlist successfully", response));
    }

    @PostMapping("/promote/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "PROMOTE_WAITLIST_ATTENDEE", entityType = "WAITLIST")
    public ResponseEntity<ApiResponse<Void>> promoteNextWaitlistedAttendee(@PathVariable("eventId") String eventId) {
        capacityService.promoteNextWaitlistedAttendee(eventId);
        return ResponseEntity.ok(ApiResponse.success("Automatic promotion executed successfully", null));
    }

    @GetMapping("/waitlist/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<ApiResponse<List<WaitlistResponse>>> getWaitlistByEvent(@PathVariable("eventId") String eventId) {
        List<WaitlistResponse> list = capacityService.getWaitlistByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/stats/event/{eventId}")
    public ResponseEntity<ApiResponse<RegistrationStatsResponse>> getRegistrationStats(@PathVariable("eventId") String eventId) {
        RegistrationStatsResponse stats = capacityService.getRegistrationStats(eventId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/dashboard/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<ApiResponse<RegistrationDashboardResponse>> getRegistrationDashboard(@PathVariable("eventId") String eventId) {
        RegistrationDashboardResponse dashboard = capacityService.getRegistrationDashboard(eventId);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/export/csv/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<byte[]> exportRegistrationsCsv(@PathVariable("eventId") String eventId) {
        byte[] csvData = exportService.exportRegistrationsCsv(eventId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=registrations_" + eventId + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @GetMapping("/export/excel/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<byte[]> exportRegistrationsExcel(@PathVariable("eventId") String eventId) {
        byte[] excelData = exportService.exportRegistrationsExcel(eventId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=registrations_" + eventId + ".xls")
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(excelData);
    }
}
