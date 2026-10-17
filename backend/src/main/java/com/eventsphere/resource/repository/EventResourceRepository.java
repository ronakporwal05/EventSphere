package com.eventsphere.resource.repository;

import com.eventsphere.resource.entity.EventResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventResourceRepository extends JpaRepository<EventResource, String> {
    List<EventResource> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId);
}
