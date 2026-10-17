package com.eventsphere.certificate.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "certificate_templates", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant_id", "event_id", "name"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateTemplate extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String name;

    @Column(name = "html_content", nullable = false, columnDefinition = "TEXT")
    private String htmlContent;

    @Column(name = "background_url")
    private String backgroundUrl;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
