package com.eventsphere.form.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormResponseDTO {
    private String id;
    private String formId;
    private String registrationId;
    private Instant submittedAt;
    private List<FormAnswerDTO> answers;
}
