package com.eventsphere.form.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldOptionDTO {
    private String id;

    @NotBlank(message = "Option label is required")
    private String optionLabel;

    @NotBlank(message = "Option value is required")
    private String optionValue;

    private int displayOrder;
}
