package com.eventsphere.workflow.repository;

import com.eventsphere.workflow.entity.ApprovalWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalWorkflowRepository extends JpaRepository<ApprovalWorkflow, String> {
    List<ApprovalWorkflow> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId);
    Optional<ApprovalWorkflow> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
}
