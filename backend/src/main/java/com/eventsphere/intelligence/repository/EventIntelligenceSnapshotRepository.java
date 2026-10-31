package com.eventsphere.intelligence.repository;

import com.eventsphere.intelligence.entity.EventIntelligenceSnapshot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventIntelligenceSnapshotRepository extends JpaRepository<EventIntelligenceSnapshot, String> {

    Optional<EventIntelligenceSnapshot> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);

    Page<EventIntelligenceSnapshot> findByTenantIdAndEventIdAndDeletedFalseOrderByCreatedAtDesc(
            String tenantId, String eventId, Pageable pageable);

    Optional<EventIntelligenceSnapshot> findFirstByTenantIdAndEventIdAndDeletedFalseOrderByCreatedAtDesc(
            String tenantId, String eventId);
}
