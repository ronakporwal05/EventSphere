package com.eventsphere.workflow.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.workflow.dto.WorkflowDecisionRequest;
import com.eventsphere.workflow.dto.WorkflowResponse;
import com.eventsphere.workflow.dto.WorkflowSubmitRequest;
import com.eventsphere.workflow.service.WorkflowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workflows")
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "SUBMIT_APPROVAL_WORKFLOW", entityType = "WORKFLOW")
    public ResponseEntity<ApiResponse<WorkflowResponse>> submitForApproval(@Valid @RequestBody WorkflowSubmitRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        WorkflowResponse response = workflowService.submitForApproval(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Submitted for approval successfully", response));
    }

    @PostMapping("/{id}/decision")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    @Auditable(action = "DECIDE_APPROVAL_WORKFLOW", entityType = "WORKFLOW")
    public ResponseEntity<ApiResponse<WorkflowResponse>> processDecision(
            @PathVariable("id") String id,
            @Valid @RequestBody WorkflowDecisionRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        WorkflowResponse response = workflowService.processDecision(currentUserId, id, request);
        return ResponseEntity.ok(ApiResponse.success("Approval decision recorded", response));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<WorkflowResponse>>> getWorkflowsByEvent(@PathVariable("eventId") String eventId) {
        List<WorkflowResponse> list = workflowService.getWorkflowsByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
