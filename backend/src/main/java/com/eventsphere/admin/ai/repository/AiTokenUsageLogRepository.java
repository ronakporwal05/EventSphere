package com.eventsphere.admin.ai.repository;

import com.eventsphere.admin.ai.entity.AiTokenUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiTokenUsageLogRepository extends JpaRepository<AiTokenUsageLog, String> {
    List<AiTokenUsageLog> findByTenantId(String tenantId);

    @Query("SELECT SUM(l.totalTokens) FROM AiTokenUsageLog l WHERE l.tenantId = :tenantId")
    Long sumTotalTokensByTenantId(@Param("tenantId") String tenantId);

    @Query("SELECT SUM(l.estimatedCostUsd) FROM AiTokenUsageLog l WHERE l.tenantId = :tenantId")
    Double sumEstimatedCostByTenantId(@Param("tenantId") String tenantId);
}
