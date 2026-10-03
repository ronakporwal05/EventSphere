package com.eventsphere.team.repository;

import com.eventsphere.team.entity.Team;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, String> {
    Page<Team> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId, Pageable pageable);
    Optional<Team> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
    Optional<Team> findByTenantIdAndCodeAndDeletedFalse(String tenantId, String code);
    boolean existsByTenantIdAndEventIdAndNameAndDeletedFalse(String tenantId, String eventId, String name);
}
