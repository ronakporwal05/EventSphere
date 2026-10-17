package com.eventsphere.invitation.entity;

import com.eventsphere.auth.entity.Role;
import com.eventsphere.auth.entity.User;
import com.eventsphere.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "invitations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invitation extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    private String department;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // PENDING, ACCEPTED, EXPIRED, REVOKED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_by", nullable = false)
    private User invitedBy;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;
}
