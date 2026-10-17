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
public class FormAnswerDTO {

    @NotBlank(message = "Field ID is required")
    private String fieldId;

    private String answerValue;
}
