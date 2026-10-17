package com.eventsphere.form.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "registration_forms", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant_id", "event_id", "version"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationForm extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(name = "is_published", nullable = false)
    @Builder.Default
    private boolean published = false;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<FormSection> sections = new ArrayList<>();
}
