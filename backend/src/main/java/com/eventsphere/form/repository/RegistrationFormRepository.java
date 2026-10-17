package com.eventsphere.form.repository;

import com.eventsphere.form.entity.RegistrationForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationFormRepository extends JpaRepository<RegistrationForm, String> {
    Optional<RegistrationForm> findByTenantIdAndEventIdAndPublishedTrueAndDeletedFalse(String tenantId, String eventId);
    Optional<RegistrationForm> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
    List<RegistrationForm> findByTenantIdAndEventIdAndDeletedFalseOrderByVersionDesc(String tenantId, String eventId);
}
