package com.eventsphere.certificate.repository;

import com.eventsphere.certificate.entity.CertificateTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateTemplateRepository extends JpaRepository<CertificateTemplate, String> {
    List<CertificateTemplate> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId);
    Optional<CertificateTemplate> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
    boolean existsByTenantIdAndEventIdAndNameAndDeletedFalse(String tenantId, String eventId, String name);
}
