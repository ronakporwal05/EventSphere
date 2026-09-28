package com.eventsphere.capacity.repository;

import com.eventsphere.capacity.entity.WaitlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WaitlistRepository extends JpaRepository<WaitlistEntry, String> {
    List<WaitlistEntry> findByTenantIdAndEventIdAndStatusAndDeletedFalseOrderByPositionAsc(String tenantId, String eventId, String status);
    Optional<WaitlistEntry> findFirstByTenantIdAndEventIdAndStatusAndDeletedFalseOrderByPositionAsc(String tenantId, String eventId, String status);
    long countByTenantIdAndEventIdAndStatusAndDeletedFalse(String tenantId, String eventId, String status);
    Optional<WaitlistEntry> findByTenantIdAndRegistrationIdAndDeletedFalse(String tenantId, String registrationId);
}
