package com.eventsphere.admin.ai.repository;

import com.eventsphere.admin.ai.entity.AiModelConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiModelConfigRepository extends JpaRepository<AiModelConfig, String> {
    Optional<AiModelConfig> findByTenantId(String tenantId);
}
