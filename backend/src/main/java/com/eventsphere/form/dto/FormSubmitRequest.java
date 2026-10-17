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
public class FormSubmitRequest {

    @NotBlank(message = "Registration ID is required")
    private String registrationId;

    @NotBlank(message = "Form ID is required")
    private String formId;

    @Valid
    private List<FormAnswerDTO> answers;
}
