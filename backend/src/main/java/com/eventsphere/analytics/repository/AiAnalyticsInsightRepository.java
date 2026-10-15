package com.eventsphere.analytics.repository;

import com.eventsphere.analytics.entity.AiAnalyticsInsightEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiAnalyticsInsightRepository extends JpaRepository<AiAnalyticsInsightEntity, String> {
    Optional<AiAnalyticsInsightEntity> findTopByTenantIdAndEventIdOrderByCreatedAtDesc(String tenantId, String eventId);
}
