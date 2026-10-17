package com.eventsphere.resource.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_resources")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResource extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @Column(name = "quantity_allocated", nullable = false)
    @Builder.Default
    private int quantityAllocated = 1;

    @Column(nullable = false)
    @Builder.Default
    private String status = "REQUESTED"; // REQUESTED, APPROVED, DISPATCHED, RETURNED
}
