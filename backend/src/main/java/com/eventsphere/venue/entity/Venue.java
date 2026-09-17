package com.eventsphere.venue.entity;

import com.eventsphere.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "venues")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Venue extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String name;

    private String address;
    private String city;
    private String state;
    private String country;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(nullable = false)
    @Builder.Default
    private int capacity = 0;

    @Column(name = "is_virtual", nullable = false)
    @Builder.Default
    private boolean virtual = false;

    @Column(name = "virtual_url")
    private String virtualUrl;

    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Room> rooms = new ArrayList<>();
}
