package com.eventsphere.report.repository;

import com.eventsphere.report.entity.AiReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiReportRepository extends JpaRepository<AiReport, String> {
    Page<AiReport> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId, Pageable pageable);
    Optional<AiReport> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
}
