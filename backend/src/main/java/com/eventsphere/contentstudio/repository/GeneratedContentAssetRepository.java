package com.eventsphere.contentstudio.repository;

import com.eventsphere.contentstudio.entity.GeneratedContentAsset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GeneratedContentAssetRepository extends JpaRepository<GeneratedContentAsset, String> {
    Page<GeneratedContentAsset> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId, Pageable pageable);
    Optional<GeneratedContentAsset> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
}
