package com.eventsphere.certificate.repository;

import com.eventsphere.certificate.entity.Certificate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, String> {
    Page<Certificate> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId, Pageable pageable);
    Optional<Certificate> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
    Optional<Certificate> findByVerificationToken(String verificationToken);
    Optional<Certificate> findByTenantIdAndRegistrationIdAndDeletedFalse(String tenantId, String registrationId);
    boolean existsByTenantIdAndEventIdAndRegistrationIdAndDeletedFalse(String tenantId, String eventId, String registrationId);
}
