package com.eventsphere.speaker.entity;

import com.eventsphere.common.entity.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "speakers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Speaker extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String title;
    private String organization;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "twitter_url")
    private String twitterUrl;
}
