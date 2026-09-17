package com.eventsphere.organization.service;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.organization.dto.DepartmentRequest;
import com.eventsphere.organization.dto.DepartmentResponse;
import com.eventsphere.organization.dto.OrganizationRequest;
import com.eventsphere.organization.dto.OrganizationResponse;
import com.eventsphere.organization.entity.Department;
import com.eventsphere.organization.entity.Organization;
import com.eventsphere.organization.repository.DepartmentRepository;
import com.eventsphere.organization.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public OrganizationResponse createOrUpdateOrganization(OrganizationRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Saving organization for tenant: {}", tenantId);

        Optional<Organization> existingOpt = organizationRepository.findByTenantId(tenantId);
        Organization org;

        if (existingOpt.isPresent()) {
            org = existingOpt.get();
            org.setName(request.getName());
            org.setLegalName(request.getLegalName());
            org.setTaxId(request.getTaxId());
            org.setWebsite(request.getWebsite());
            org.setSupportEmail(request.getSupportEmail());
            org.setAddress(request.getAddress());
            org.setCity(request.getCity());
            org.setCountry(request.getCountry());
        } else {
            org = Organization.builder()
                    .tenantId(tenantId)
                    .name(request.getName())
                    .legalName(request.getLegalName())
                    .taxId(request.getTaxId())
                    .website(request.getWebsite())
                    .supportEmail(request.getSupportEmail())
                    .address(request.getAddress())
                    .city(request.getCity())
                    .country(request.getCountry())
                    .build();
        }

        Organization saved = organizationRepository.save(org);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public OrganizationResponse getOrganization() {
        String tenantId = TenantContext.getTenantId();
        Organization org = organizationRepository.findByTenantId(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization details not configured for current tenant"));
        return mapToResponse(org);
    }

    @Override
    @Transactional
    public DepartmentResponse addDepartment(DepartmentRequest request) {
        String tenantId = TenantContext.getTenantId();
        Organization org = organizationRepository.findByTenantId(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization must be created before adding departments"));

        if (departmentRepository.existsByOrganizationIdAndName(org.getId(), request.getName())) {
            throw new ResourceConflictException("Department '" + request.getName() + "' already exists in this organization");
        }

        Department dept = Department.builder()
                .tenantId(tenantId)
                .organization(org)
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .build();

        Department saved = departmentRepository.save(dept);
        return mapToDepartmentResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getDepartments() {
        String tenantId = TenantContext.getTenantId();
        Organization org = organizationRepository.findByTenantId(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization details not found"));

        return departmentRepository.findByTenantIdAndOrganizationId(tenantId, org.getId()).stream()
                .map(this::mapToDepartmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteDepartment(String departmentId) {
        String tenantId = TenantContext.getTenantId();
        Department dept = departmentRepository.findByIdAndTenantId(departmentId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + departmentId));
        departmentRepository.delete(dept);
    }

    private OrganizationResponse mapToResponse(Organization org) {
        List<DepartmentResponse> depts = org.getDepartments() != null ?
                org.getDepartments().stream().map(this::mapToDepartmentResponse).collect(Collectors.toList()) : List.of();

        return OrganizationResponse.builder()
                .id(org.getId())
                .tenantId(org.getTenantId())
                .name(org.getName())
                .legalName(org.getLegalName())
                .taxId(org.getTaxId())
                .website(org.getWebsite())
                .supportEmail(org.getSupportEmail())
                .address(org.getAddress())
                .city(org.getCity())
                .country(org.getCountry())
                .departments(depts)
                .createdAt(org.getCreatedAt())
                .updatedAt(org.getUpdatedAt())
                .build();
    }

    private DepartmentResponse mapToDepartmentResponse(Department dept) {
        return DepartmentResponse.builder()
                .id(dept.getId())
                .organizationId(dept.getOrganization().getId())
                .name(dept.getName())
                .code(dept.getCode())
                .description(dept.getDescription())
                .createdAt(dept.getCreatedAt())
                .build();
    }
}
