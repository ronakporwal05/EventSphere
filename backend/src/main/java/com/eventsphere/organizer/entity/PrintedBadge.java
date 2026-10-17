package com.eventsphere.organizer.entity;

import com.eventsphere.auth.entity.User;
import com.eventsphere.event.entity.Event;
import com.eventsphere.registration.entity.Registration;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "printed_badges")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrintedBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @Column(name = "badge_type", nullable = false)
    @Builder.Default
    private String badgeType = "ATTENDEE"; // ATTENDEE, SPEAKER, VIP, PRESS, ORGANIZER, VOLUNTEER

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "printed_by_user_id")
    private User printedBy;

    @Column(name = "print_count", nullable = false)
    @Builder.Default
    private int printCount = 1;

    @Column(name = "last_printed_at", nullable = false)
    @Builder.Default
    private Instant lastPrintedAt = Instant.now();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
