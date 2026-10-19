package com.eventsphere.contentstudio.entity;

import com.eventsphere.auth.entity.User;
import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "generated_content_assets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneratedContentAsset extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "content_type", nullable = false)
    private String contentType; // MARKETING_COPY, SOCIAL_POST, SPEAKER_BIO, SESSION_DESC

    @Column(nullable = false)
    @Builder.Default
    private String platform = "GENERAL"; // LINKEDIN, TWITTER, INSTAGRAM, EMAIL, LANDING_PAGE

    @Column(nullable = false)
    @Builder.Default
    private String tone = "PROFESSIONAL"; // PROFESSIONAL, ENERGETIC, EXECUTIVE, CASUAL

    @Column(nullable = false)
    private String title;

    @Column(name = "generated_text", nullable = false, columnDefinition = "TEXT")
    private String generatedText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdByUser;
}
