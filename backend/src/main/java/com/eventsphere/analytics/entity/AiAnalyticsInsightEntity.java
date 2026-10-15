package com.eventsphere.analytics.entity;

import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "ai_analytics_insights")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalyticsInsightEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "predicted_attendance_count", nullable = false)
    private int predictedAttendanceCount;

    @Column(name = "predicted_check_in_rate", nullable = false)
    private double predictedCheckInRate;

    @Column(name = "capacity_risk_level", nullable = false)
    @Builder.Default
    private String capacityRiskLevel = "LOW"; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "peak_check_in_hour")
    private String peakCheckInHour;

    @Column(name = "anomalies_detected", columnDefinition = "TEXT")
    private String anomaliesDetected;

    @Column(name = "ai_summary", nullable = false, columnDefinition = "TEXT")
    private String aiSummary;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
