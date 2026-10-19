package com.eventsphere.docintel.repository;

import com.eventsphere.docintel.entity.DocumentProcessingJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentProcessingJobRepository extends JpaRepository<DocumentProcessingJob, String> {
    Page<DocumentProcessingJob> findByTenantIdAndDeletedFalse(String tenantId, Pageable pageable);
    Optional<DocumentProcessingJob> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
}
