package com.eventsphere.form.repository;

import com.eventsphere.form.entity.FormResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FormResponseRepository extends JpaRepository<FormResponse, String> {
    Optional<FormResponse> findByTenantIdAndRegistrationIdAndDeletedFalse(String tenantId, String registrationId);
}
