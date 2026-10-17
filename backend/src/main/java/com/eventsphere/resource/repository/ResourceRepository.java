package com.eventsphere.resource.repository;

import com.eventsphere.resource.entity.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, String> {
    Page<Resource> findByTenantIdAndDeletedFalse(String tenantId, Pageable pageable);
    Optional<Resource> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
}
