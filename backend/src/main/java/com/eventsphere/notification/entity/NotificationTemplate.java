package com.eventsphere.notification.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_templates", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant_id", "code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationTemplate extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(nullable = false)
    private String code; // REGISTRATION_CONFIRMATION, REMINDER, CERTIFICATE_READY, BROADCAST, EMERGENCY

    @Column(nullable = false)
    private String subject;

    @Column(name = "body_template", nullable = false, columnDefinition = "TEXT")
    private String bodyTemplate;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
