package com.eventsphere.event.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.venue.entity.Venue;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "banner_url")
    private String bannerUrl;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(nullable = false)
    private String category;

    @Column(name = "event_type", nullable = false)
    @Builder.Default
    private String eventType = "HYBRID";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EventState status = EventState.DRAFT;

    @Column(nullable = false)
    @Builder.Default
    private int capacity = 0;

    @Column(name = "max_capacity")
    private Integer maxCapacity;

    @Column(name = "registration_start")
    private Instant registrationStart;

    @Column(name = "registration_end")
    private Instant registrationEnd;

    @Column(name = "registration_deadline")
    private Instant registrationDeadline;

    public Integer getMaxCapacity() {
        if (this.maxCapacity != null) {
            return this.maxCapacity;
        }
        return this.capacity > 0 ? this.capacity : null;
    }

    public Instant getRegistrationDeadline() {
        return this.registrationDeadline != null ? this.registrationDeadline : this.registrationEnd;
    }

    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @Column(name = "end_date", nullable = false)
    private Instant endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id")
    private Venue venue;

    @Column(name = "is_public", nullable = false)
    @Builder.Default
    private boolean isPublic = true;

    @Column(name = "require_approval", nullable = false)
    @Builder.Default
    private boolean requireApproval = false;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<EventCustomField> customFields = new ArrayList<>();
}
