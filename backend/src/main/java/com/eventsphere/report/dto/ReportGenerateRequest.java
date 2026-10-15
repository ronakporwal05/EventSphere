package com.eventsphere.report.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportGenerateRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "Report type is required (POST_EVENT_SUMMARY, OPERATIONS_PERFORMANCE, EXECUTIVE_BRIEFING)")
    private String reportType;

    private String customTitle;
}
