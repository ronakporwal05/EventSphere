package com.eventsphere.volunteer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "volunteer_performance")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id", nullable = false, unique = true)
    private Volunteer volunteer;

    @Column(name = "total_scans_performed", nullable = false)
    @Builder.Default
    private int totalScansPerformed = 0;

    @Column(name = "tasks_completed", nullable = false)
    @Builder.Default
    private int tasksCompleted = 0;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal rating = BigDecimal.valueOf(5.00);

    private String notes;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
