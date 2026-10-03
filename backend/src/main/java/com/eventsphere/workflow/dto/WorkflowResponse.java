package com.eventsphere.workflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowResponse {
    private String id;
    private String eventId;
    private String requesterEmail;
    private String approverEmail;
    private String stage;
    private String status;
    private String comments;
    private Instant decisionDate;
    private Instant createdAt;
}
