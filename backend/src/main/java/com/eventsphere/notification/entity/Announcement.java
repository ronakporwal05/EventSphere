package com.eventsphere.notification.entity;

import com.eventsphere.auth.entity.User;
import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "announcements")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Announcement extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    @Builder.Default
    private String category = "GENERAL"; // GENERAL, REMINDER, URGENT, EMERGENCY

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by_user_id")
    private User postedBy;
}
