package com.eventsphere.organization.entity;

import com.eventsphere.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "organizations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organization extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false, unique = true)
    private String tenantId;

    @Column(nullable = false)
    private String name;

    @Column(name = "legal_name")
    private String legalName;

    @Column(name = "tax_id")
    private String taxId;

    private String website;

    @Column(name = "support_email")
    private String supportEmail;

    private String address;
    private String city;
    private String country;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Department> departments = new ArrayList<>();
}
