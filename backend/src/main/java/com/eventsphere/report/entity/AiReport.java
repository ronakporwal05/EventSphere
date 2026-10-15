package com.eventsphere.report.entity;

import com.eventsphere.auth.entity.User;
import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_reports")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiReport extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "report_type", nullable = false)
    private String reportType; // POST_EVENT_SUMMARY, OPERATIONS_PERFORMANCE, EXECUTIVE_BRIEFING

    @Column(nullable = false)
    private String title;

    @Column(name = "markdown_content", nullable = false, columnDefinition = "TEXT")
    private String markdownContent;

    @Column(nullable = false)
    @Builder.Default
    private String status = "COMPLETED"; // GENERATING, COMPLETED, FAILED

    @Column(name = "error_message")
    private String errorMessage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generated_by_user_id")
    private User generatedBy;
}
