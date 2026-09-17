package com.eventsphere.category.repository;

import com.eventsphere.category.entity.EventCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventCategoryRepository extends JpaRepository<EventCategory, String> {
    Page<EventCategory> findByTenantIdAndDeletedFalse(String tenantId, Pageable pageable);
    Optional<EventCategory> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
    boolean existsByTenantIdAndSlugAndDeletedFalse(String tenantId, String slug);
}
