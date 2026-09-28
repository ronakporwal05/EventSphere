package com.eventsphere.ticket.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ticket_types", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant_id", "event_id", "name"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketType extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "total_quantity", nullable = false)
    @Builder.Default
    private int totalQuantity = 100;

    @Column(name = "available_quantity", nullable = false)
    @Builder.Default
    private int availableQuantity = 100;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
