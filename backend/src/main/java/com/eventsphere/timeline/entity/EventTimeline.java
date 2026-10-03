package com.eventsphere.timeline.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "event_timelines")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventTimeline extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "milestone_date", nullable = false)
    private Instant milestoneDate;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PLANNED"; // PLANNED, IN_PROGRESS, COMPLETED, DELAYED

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;
}
