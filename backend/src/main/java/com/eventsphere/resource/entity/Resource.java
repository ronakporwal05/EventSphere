package com.eventsphere.resource.entity;

import com.eventsphere.common.entity.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "resources")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String name;

    @Column(name = "resource_type", nullable = false)
    private String resourceType;

    @Column(name = "quantity_available", nullable = false)
    @Builder.Default
    private int quantityAvailable = 1;

    @Column(name = "unit_cost")
    private BigDecimal unitCost;

    private String notes;
}
