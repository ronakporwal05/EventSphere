package com.eventsphere.feedback.repository;

import com.eventsphere.feedback.entity.EventFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventFeedbackRepository extends JpaRepository<EventFeedback, String> {
    Page<EventFeedback> findByTenantIdAndEventId(String tenantId, String eventId, Pageable pageable);
    List<EventFeedback> findByTenantIdAndEventId(String tenantId, String eventId);
    long countByTenantIdAndEventId(String tenantId, String eventId);
}
