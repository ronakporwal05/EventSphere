package com.eventsphere.workflow.service;

import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.workflow.dto.WorkflowDecisionRequest;
import com.eventsphere.workflow.dto.WorkflowResponse;
import com.eventsphere.workflow.dto.WorkflowSubmitRequest;
import com.eventsphere.workflow.entity.ApprovalWorkflow;
import com.eventsphere.workflow.repository.ApprovalWorkflowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowServiceImpl implements WorkflowService {

    private final ApprovalWorkflowRepository workflowRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public WorkflowResponse submitForApproval(String currentUserId, WorkflowSubmitRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Submitting event '{}' stage '{}' for approval", request.getEventId(), request.getStage());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        User requester = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + currentUserId));

        ApprovalWorkflow workflow = ApprovalWorkflow.builder()
                .tenantId(tenantId)
                .event(event)
                .requester(requester)
                .stage(request.getStage())
                .status("PENDING")
                .comments(request.getComments())
                .build();

        ApprovalWorkflow saved = workflowRepository.save(workflow);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public WorkflowResponse processDecision(String currentUserId, String id, WorkflowDecisionRequest request) {
        String tenantId = TenantContext.getTenantId();
        ApprovalWorkflow workflow = workflowRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Approval workflow request not found with ID: " + id));

        User approver = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + currentUserId));

        workflow.setApprover(approver);
        workflow.setStatus(request.getStatus().toUpperCase());
        workflow.setComments(request.getComments());
        workflow.setDecisionDate(Instant.now());

        ApprovalWorkflow saved = workflowRepository.save(workflow);
        log.info("Workflow ID '{}' processed decision: {}", id, request.getStatus());
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkflowResponse> getWorkflowsByEvent(String eventId) {
        String tenantId = TenantContext.getTenantId();
        return workflowRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private WorkflowResponse mapToResponse(ApprovalWorkflow wf) {
        return WorkflowResponse.builder()
                .id(wf.getId())
                .eventId(wf.getEvent().getId())
                .requesterEmail(wf.getRequester().getEmail())
                .approverEmail(wf.getApprover() != null ? wf.getApprover().getEmail() : null)
                .stage(wf.getStage())
                .status(wf.getStatus())
                .comments(wf.getComments())
                .decisionDate(wf.getDecisionDate())
                .createdAt(wf.getCreatedAt())
                .build();
    }
}
