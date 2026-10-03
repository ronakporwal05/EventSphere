package com.eventsphere.task.repository;

import com.eventsphere.task.entity.EventTask;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventTaskRepository extends JpaRepository<EventTask, String> {
    Page<EventTask> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId, Pageable pageable);
    List<EventTask> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId);
    Optional<EventTask> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
}
