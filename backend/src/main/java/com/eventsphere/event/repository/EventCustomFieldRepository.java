package com.eventsphere.event.repository;

import com.eventsphere.event.entity.EventCustomField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventCustomFieldRepository extends JpaRepository<EventCustomField, String> {
    List<EventCustomField> findByTenantIdAndEventIdOrderByDisplayOrderAsc(String tenantId, String eventId);
}
