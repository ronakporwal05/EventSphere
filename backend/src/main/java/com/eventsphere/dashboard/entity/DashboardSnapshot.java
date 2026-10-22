package com.eventsphere.dashboard.entity;

import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "dashboard_snapshots")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "live_registration_count", nullable = false)
    private int liveRegistrationCount;

    @Column(name = "live_attendance_count", nullable = false)
    private int liveAttendanceCount;

    @Column(name = "remaining_capacity", nullable = false)
    private int remainingCapacity;

    @Column(name = "active_volunteers_count", nullable = false)
    private int activeVolunteersCount;

    @Column(name = "pending_certificates_count", nullable = false)
    private int pendingCertificatesCount;

    @Column(name = "pending_notifications_count", nullable = false)
    private int pendingNotificationsCount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
