package com.eventsphere.event.repository;

import com.eventsphere.event.entity.Event;
import com.eventsphere.event.entity.EventState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    Page<Event> findByTenantId(String tenantId, Pageable pageable);
    Page<Event> findByTenantIdAndDeletedFalse(String tenantId, Pageable pageable);
    Page<Event> findByTenantIdAndStatus(String tenantId, EventState status, Pageable pageable);
    Page<Event> findByTenantIdAndStatusAndDeletedFalse(String tenantId, EventState status, Pageable pageable);
    Optional<Event> findByIdAndTenantId(String id, String tenantId);
    Optional<Event> findBySlugAndTenantId(String slug, String tenantId);
    boolean existsBySlugAndTenantId(String slug, String tenantId);
}
