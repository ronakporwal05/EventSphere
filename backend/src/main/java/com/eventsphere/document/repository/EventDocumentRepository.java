package com.eventsphere.document.repository;

import com.eventsphere.document.entity.EventDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventDocumentRepository extends JpaRepository<EventDocument, String> {
    List<EventDocument> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId);
    Optional<EventDocument> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
}
