package com.eventsphere.venue.entity;

import com.eventsphere.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private int capacity = 0;

    @Column(name = "floor_level")
    private String floorLevel;

    @Column(name = "equipment_notes")
    private String equipmentNotes;
}
