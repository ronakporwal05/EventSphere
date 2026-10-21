package com.eventsphere.feedback.entity;

import com.eventsphere.event.entity.Event;
import com.eventsphere.registration.entity.Registration;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "event_feedback")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id")
    private Registration registration;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    @Builder.Default
    private String category = "GENERAL";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    @Builder.Default
    private String sentiment = "NEUTRAL"; // POSITIVE, NEUTRAL, NEGATIVE

    private String emotion; // DELIGHTED, SATISFIED, CONFUSED, FRUSTRATED, ANGRY

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
