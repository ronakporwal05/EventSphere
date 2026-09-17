package com.eventsphere.speaker.repository;

import com.eventsphere.speaker.entity.Speaker;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpeakerRepository extends JpaRepository<Speaker, String> {
    Page<Speaker> findByTenantIdAndDeletedFalse(String tenantId, Pageable pageable);
    Optional<Speaker> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
}
