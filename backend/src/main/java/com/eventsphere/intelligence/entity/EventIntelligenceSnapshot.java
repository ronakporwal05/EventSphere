package com.eventsphere.intelligence.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_intelligence_snapshots")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventIntelligenceSnapshot extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "actual_progress", nullable = false)
    @Builder.Default
    private double actualProgress = 0.0;

    @Column(name = "planned_progress", nullable = false)
    @Builder.Default
    private double plannedProgress = 0.0;

    @Column(name = "progress_gap", nullable = false)
    @Builder.Default
    private double progressGap = 0.0;

    @Column(name = "delay_risk_score", nullable = false)
    @Builder.Default
    private double delayRiskScore = 0.0;

    @Column(name = "delay_risk_level", length = 50)
    @Builder.Default
    private String delayRiskLevel = "LOW";

    @Column(name = "predicted_registrations")
    @Builder.Default
    private int predictedRegistrations = 0;

    @Column(name = "expected_no_show_rate")
    @Builder.Default
    private double expectedNoShowRate = 0.0;

    @Column(name = "anomaly_flags_count")
    @Builder.Default
    private int anomalyFlagsCount = 0;

    @Column(name = "snapshot_data", columnDefinition = "TEXT")
    private String snapshotData;
}
