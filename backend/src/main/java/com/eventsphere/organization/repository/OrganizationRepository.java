package com.eventsphere.organization.repository;

import com.eventsphere.organization.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, String> {
    Optional<Organization> findByTenantId(String tenantId);
    boolean existsByTenantId(String tenantId);
}
