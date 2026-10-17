package com.eventsphere.volunteer.entity;

import com.eventsphere.auth.entity.User;
import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "volunteers", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant_id", "event_id", "user_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Volunteer extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "assigned_role", nullable = false)
    @Builder.Default
    private String assignedRole = "SCANNER"; // SCANNER, INFO_DESK, LOGISTICS, VIP_ESCORT

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    @Column(name = "scanner_mode_enabled", nullable = false)
    @Builder.Default
    private boolean scannerModeEnabled = true;
}
