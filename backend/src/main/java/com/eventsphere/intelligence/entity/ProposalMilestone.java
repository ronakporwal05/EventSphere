package com.eventsphere.intelligence.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import com.eventsphere.task.entity.EventTask;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "proposal_milestones")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalMilestone extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id", nullable = false)
    private EventProposal proposal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String deliverables;

    @Column(columnDefinition = "TEXT")
    private String dependencies;

    @Column(name = "target_date")
    private Instant targetDate;

    @Column(nullable = false)
    @Builder.Default
    private double weight = 1.0;

    @Column(nullable = false)
    @Builder.Default
    private boolean approved = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matched_task_id")
    private EventTask matchedTask;

    @Column(name = "similarity_score")
    @Builder.Default
    private double similarityScore = 0.0;
}
