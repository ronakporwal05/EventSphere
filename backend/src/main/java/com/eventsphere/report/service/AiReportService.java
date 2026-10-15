package com.eventsphere.report.service;

import com.eventsphere.report.dto.ReportGenerateRequest;
import com.eventsphere.report.dto.ReportResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AiReportService {

    ReportResponse generateReport(String currentUserId, ReportGenerateRequest request);

    ReportResponse getReportById(String reportId);

    Page<ReportResponse> getReportsByEvent(String eventId, Pageable pageable);

    byte[] exportReportPdf(String reportId);
}
