package com.eventsphere.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private String id;
    private String eventId;
    private String eventTitle;
    private String reportType;
    private String title;
    private String markdownContent;
    private String status;
    private String generatedByEmail;
    private Instant createdAt;
}
