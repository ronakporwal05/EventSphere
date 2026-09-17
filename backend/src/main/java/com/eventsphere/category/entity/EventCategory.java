package com.eventsphere.category.entity;

import com.eventsphere.common.entity.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "event_categories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventCategory extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String slug;

    private String description;

    @Column(name = "color_code")
    @Builder.Default
    private String colorCode = "#4F46E5";

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
