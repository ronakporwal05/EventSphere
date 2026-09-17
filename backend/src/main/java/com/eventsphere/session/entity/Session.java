package com.eventsphere.session.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import com.eventsphere.venue.entity.Room;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sessions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Session extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(nullable = false)
    @Builder.Default
    private int capacity = 0;

    @Column(nullable = false)
    @Builder.Default
    private String status = "SCHEDULED";

    @ElementCollection
    @CollectionTable(name = "session_speakers", joinColumns = @JoinColumn(name = "session_id"))
    @Column(name = "user_id")
    @Builder.Default
    private Set<String> speakerUserIds = new HashSet<>();
}
