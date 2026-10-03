package com.eventsphere.attendance.entity;

import com.eventsphere.auth.entity.User;
import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.ticket.entity.Ticket;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "attendances", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant_id", "event_id", "ticket_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attendance extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name = "check_in_time", nullable = false)
    @Builder.Default
    private Instant checkInTime = Instant.now();

    @Column(name = "check_in_method", nullable = false)
    @Builder.Default
    private String checkInMethod = "QR_SCAN"; // QR_SCAN, MANUAL, BULK

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checked_in_by_user_id")
    private User checkedInBy;

    @Column(nullable = false)
    @Builder.Default
    private String status = "CHECKED_IN"; // CHECKED_IN, CHECKED_OUT, CORRECTION_REMOVED

    private String notes;
}
