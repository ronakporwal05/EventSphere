package com.eventsphere.intelligence.repository;

import com.eventsphere.intelligence.entity.EventProposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventProposalRepository extends JpaRepository<EventProposal, String> {

    Optional<EventProposal> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);

    List<EventProposal> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId);

    Page<EventProposal> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId, Pageable pageable);

    Optional<EventProposal> findFirstByTenantIdAndEventIdAndStatusAndDeletedFalseOrderByCreatedAtDesc(
            String tenantId, String eventId, String status);
}
