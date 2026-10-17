package com.eventsphere.certificate.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import com.eventsphere.registration.entity.Registration;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Certificate extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private CertificateTemplate template;

    @Column(name = "certificate_number", nullable = false, unique = true)
    private String certificateNumber;

    @Column(name = "verification_token", nullable = false, unique = true)
    private String verificationToken;

    @Column(name = "issued_to_name", nullable = false)
    private String issuedToName;

    @Column(name = "issued_to_email", nullable = false)
    private String issuedToEmail;

    @Column(nullable = false)
    @Builder.Default
    private String status = "ISSUED"; // GENERATING, ISSUED, REVOKED, REISSUED

    @Column(name = "pdf_url")
    private String pdfUrl;

    @Column(name = "issued_at", nullable = false)
    @Builder.Default
    private Instant issuedAt = Instant.now();
}
