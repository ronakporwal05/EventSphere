package com.eventsphere.rag.repository;

import com.eventsphere.rag.entity.RagQueryLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RagQueryLogRepository extends JpaRepository<RagQueryLog, String> {
    Page<RagQueryLog> findByTenantId(String tenantId, Pageable pageable);
}
