package com.eventsphere.volunteer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "volunteer_attendances")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id", nullable = false)
    private Volunteer volunteer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id", nullable = false)
    private VolunteerShift shift;

    @Column(name = "check_in_time", nullable = false)
    @Builder.Default
    private Instant checkInTime = Instant.now();

    @Column(name = "check_out_time")
    private Instant checkOutTime;

    @Column(nullable = false)
    @Builder.Default
    private String status = "ON_DUTY"; // ON_DUTY, OFF_DUTY

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
