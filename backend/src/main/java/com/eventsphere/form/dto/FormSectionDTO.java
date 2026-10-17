package com.eventsphere.form.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormSectionDTO {
    private String id;

    @NotBlank(message = "Section title is required")
    private String title;

    private String description;
    private int displayOrder;

    @Valid
    private List<FormFieldDTO> fields;
}
