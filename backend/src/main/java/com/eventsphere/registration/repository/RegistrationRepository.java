package com.eventsphere.registration.repository;

import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.entity.RegistrationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, String> {
    Page<Registration> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId, Pageable pageable);
    Optional<Registration> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
    Optional<Registration> findByTenantIdAndRegistrationNumberAndDeletedFalse(String tenantId, String regNumber);
    boolean existsByTenantIdAndEventIdAndAttendeeEmailAndDeletedFalse(String tenantId, String eventId, String attendeeEmail);
    Optional<Registration> findByTenantIdAndEventIdAndAttendeeEmailAndDeletedFalse(String tenantId, String eventId, String attendeeEmail);
    Page<Registration> findByTenantIdAndEventIdAndStatusAndDeletedFalse(String tenantId, String eventId, RegistrationStatus status, Pageable pageable);
    long countByTenantIdAndEventIdAndStatusAndDeletedFalse(String tenantId, String eventId, RegistrationStatus status);
    long countByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId);
}
