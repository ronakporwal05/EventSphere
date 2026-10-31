package com.eventsphere.intelligence.repository;

import com.eventsphere.intelligence.entity.ProposalMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalMilestoneRepository extends JpaRepository<ProposalMilestone, String> {

    Optional<ProposalMilestone> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);

    List<ProposalMilestone> findByTenantIdAndProposalIdAndDeletedFalse(String tenantId, String proposalId);

    List<ProposalMilestone> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId);

    List<ProposalMilestone> findByTenantIdAndEventIdAndApprovedTrueAndDeletedFalse(String tenantId, String eventId);
}
