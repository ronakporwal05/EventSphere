package com.eventsphere.form.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "field_options")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldOption {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    private FormField field;

    @Column(name = "option_label", nullable = false)
    private String optionLabel;

    @Column(name = "option_value", nullable = false)
    private String optionValue;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;
}
