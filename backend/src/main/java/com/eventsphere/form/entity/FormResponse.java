package com.eventsphere.form.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.registration.entity.Registration;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "form_responses")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormResponse extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id", nullable = false)
    private RegistrationForm form;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private Instant submittedAt;

    @OneToMany(mappedBy = "response", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FormAnswer> answers = new ArrayList<>();
}
