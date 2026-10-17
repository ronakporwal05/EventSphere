package com.eventsphere.organizer.entity;

import com.eventsphere.auth.entity.User;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "organizer_actions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerAction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_user_id", nullable = false)
    private User organizer;

    @Column(name = "action_type", nullable = false)
    private String actionType; // WALK_IN_REGISTRATION, TICKET_REISSUE, BADGE_PRINT, EMERGENCY_BROADCAST, LOST_TICKET_RECOVERY

    @Column(name = "target_entity_id")
    private String targetEntityId;

    private String details;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
