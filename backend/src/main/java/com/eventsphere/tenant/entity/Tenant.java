package com.eventsphere.tenant.entity;

import com.eventsphere.common.entity.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tenant extends AuditableEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "contact_email", nullable = false)
    private String contactEmail;

    @Column(name = "subscription_tier", nullable = false)
    @Builder.Default
    private String subscriptionTier = "FREE";

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "theme_config", columnDefinition = "TEXT")
    private String themeConfig;
}
