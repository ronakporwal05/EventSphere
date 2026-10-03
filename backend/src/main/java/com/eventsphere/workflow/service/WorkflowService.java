package com.eventsphere.workflow.service;

import com.eventsphere.workflow.dto.WorkflowDecisionRequest;
import com.eventsphere.workflow.dto.WorkflowResponse;
import com.eventsphere.workflow.dto.WorkflowSubmitRequest;

import java.util.List;

public interface WorkflowService {

    WorkflowResponse submitForApproval(String currentUserId, WorkflowSubmitRequest request);

    WorkflowResponse processDecision(String currentUserId, String id, WorkflowDecisionRequest request);

    List<WorkflowResponse> getWorkflowsByEvent(String eventId);
}
