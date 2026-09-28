package com.eventsphere.capacity.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import com.eventsphere.registration.entity.Registration;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "waitlist_entries", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant_id", "event_id", "registration_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WaitlistEntry extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @Column(nullable = false)
    @Builder.Default
    private int position = 1;

    @Column(nullable = false)
    @Builder.Default
    private String status = "WAITING"; // WAITING, PROMOTED, EXPIRED, CANCELLED

    @Column(name = "promoted_at")
    private Instant promotedAt;
}
