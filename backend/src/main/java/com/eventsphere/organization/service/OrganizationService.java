package com.eventsphere.organization.service;

import com.eventsphere.organization.dto.DepartmentRequest;
import com.eventsphere.organization.dto.DepartmentResponse;
import com.eventsphere.organization.dto.OrganizationRequest;
import com.eventsphere.organization.dto.OrganizationResponse;

import java.util.List;

public interface OrganizationService {

    OrganizationResponse createOrUpdateOrganization(OrganizationRequest request);

    OrganizationResponse getOrganization();

    DepartmentResponse addDepartment(DepartmentRequest request);

    List<DepartmentResponse> getDepartments();

    void deleteDepartment(String departmentId);
}
