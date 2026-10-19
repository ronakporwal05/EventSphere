package com.eventsphere.docintel.repository;

import com.eventsphere.docintel.entity.DocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentChunkRepository extends JpaRepository<DocumentChunk, String> {
    List<DocumentChunk> findByTenantIdAndJobIdOrderByChunkIndexAsc(String tenantId, String jobId);
}
