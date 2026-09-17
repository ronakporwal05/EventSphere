package com.eventsphere.organization.repository;

import com.eventsphere.organization.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
    List<Department> findByTenantIdAndOrganizationId(String tenantId, String organizationId);
    Optional<Department> findByIdAndTenantId(String id, String tenantId);
    boolean existsByOrganizationIdAndName(String organizationId, String name);
}
