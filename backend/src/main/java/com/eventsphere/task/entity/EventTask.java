package com.eventsphere.task.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "event_tasks")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventTask extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "assignee_user_id")
    private String assigneeUserId;

    @Column(nullable = false)
    @Builder.Default
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    @Column(nullable = false)
    @Builder.Default
    private String status = "TODO"; // TODO, IN_PROGRESS, IN_REVIEW, COMPLETED

    @Column(name = "due_date")
    private Instant dueDate;

    @Column(nullable = false)
    @Builder.Default
    private double weight = 1.0;

    @Column(name = "completion_fraction", nullable = false)
    @Builder.Default
    private double completionFraction = 0.0;

    @Column(name = "is_blocked", nullable = false)
    @Builder.Default
    private boolean isBlocked = false;

    @Column(name = "blocked_reason", length = 512)
    private String blockedReason;
}
