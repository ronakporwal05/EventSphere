package com.eventsphere.event.entity;

import com.eventsphere.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_custom_fields")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventCustomField extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "field_name", nullable = false)
    private String fieldName;

    @Column(name = "field_label", nullable = false)
    private String fieldLabel;

    @Column(name = "field_type", nullable = false)
    @Builder.Default
    private String fieldType = "TEXT";

    @Column(nullable = false)
    @Builder.Default
    private boolean required = false;

    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;
}
