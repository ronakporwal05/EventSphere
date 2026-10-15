package com.eventsphere.report.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.report.dto.ReportGenerateRequest;
import com.eventsphere.report.dto.ReportResponse;
import com.eventsphere.report.service.AiReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai-reports")
@RequiredArgsConstructor
public class AiReportController {

    private final AiReportService reportService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "GENERATE_AI_REPORT", entityType = "AI_REPORT")
    public ResponseEntity<ApiResponse<ReportResponse>> generateReport(@Valid @RequestBody ReportGenerateRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        ReportResponse response = reportService.generateReport(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("AI Executive Report generated successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<ApiResponse<ReportResponse>> getReportById(@PathVariable("id") String id) {
        ReportResponse response = reportService.getReportById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<PagedResponse<ReportResponse>> getReportsByEvent(@PathVariable("eventId") String eventId, Pageable pageable) {
        Page<ReportResponse> page = reportService.getReportsByEvent(eventId, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Reports retrieved successfully"));
    }

    @GetMapping("/{id}/export/pdf")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<byte[]> exportReportPdf(@PathVariable("id") String id) {
        byte[] pdfBytes = reportService.exportReportPdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ai_report_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
