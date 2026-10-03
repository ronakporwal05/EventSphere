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
public class WorkflowDecisionRequest {

    @NotBlank(message = "Decision status is required (APPROVED/REJECTED)")
    private String status;

    private String comments;
}
