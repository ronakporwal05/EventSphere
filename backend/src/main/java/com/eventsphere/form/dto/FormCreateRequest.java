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
public class FormCreateRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "Form title is required")
    private String title;

    private String description;
    private Boolean published;

    @Valid
    private List<FormSectionDTO> sections;
}
