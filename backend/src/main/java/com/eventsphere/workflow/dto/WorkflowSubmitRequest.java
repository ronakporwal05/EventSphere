package com.eventsphere.workflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowSubmitRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "Stage is required")
    private String stage;

    private String comments;
}
