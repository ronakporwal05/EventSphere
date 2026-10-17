package com.eventsphere.volunteer.repository;

import com.eventsphere.volunteer.entity.Volunteer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, String> {
    Page<Volunteer> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId, Pageable pageable);
    Optional<Volunteer> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
    Optional<Volunteer> findByTenantIdAndEventIdAndUserIdAndDeletedFalse(String tenantId, String eventId, String userId);
    boolean existsByTenantIdAndEventIdAndUserIdAndDeletedFalse(String tenantId, String eventId, String userId);
}
