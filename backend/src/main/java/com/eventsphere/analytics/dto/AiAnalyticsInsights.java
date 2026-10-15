package com.eventsphere.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalyticsInsights {
    private String eventId;
    private String eventTitle;
    private long totalRegistrations;
    private long actualCheckIns;
    private int predictedAttendanceCount;
    private double predictedCheckInRate;
    private String capacityRiskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private String peakCheckInHour;
    private String anomaliesDetected;
    private String aiSummary;
    private Instant calculatedAt;
}
