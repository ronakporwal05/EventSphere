package com.eventsphere.organization.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.organization.dto.DepartmentRequest;
import com.eventsphere.organization.dto.DepartmentResponse;
import com.eventsphere.organization.dto.OrganizationRequest;
import com.eventsphere.organization.dto.OrganizationResponse;
import com.eventsphere.organization.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    @Auditable(action = "CONFIGURE_ORGANIZATION", entityType = "ORGANIZATION")
    public ResponseEntity<ApiResponse<OrganizationResponse>> createOrUpdateOrganization(@Valid @RequestBody OrganizationRequest request) {
        OrganizationResponse response = organizationService.createOrUpdateOrganization(request);
        return ResponseEntity.ok(ApiResponse.success("Organization profile saved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<OrganizationResponse>> getOrganization() {
        OrganizationResponse response = organizationService.getOrganization();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/departments")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    @Auditable(action = "ADD_DEPARTMENT", entityType = "DEPARTMENT")
    public ResponseEntity<ApiResponse<DepartmentResponse>> addDepartment(@Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse response = organizationService.addDepartment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Department added successfully", response));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getDepartments() {
        List<DepartmentResponse> departments = organizationService.getDepartments();
        return ResponseEntity.ok(ApiResponse.success(departments));
    }

    @DeleteMapping("/departments/{departmentId}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    @Auditable(action = "DELETE_DEPARTMENT", entityType = "DEPARTMENT")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable("departmentId") String departmentId) {
        organizationService.deleteDepartment(departmentId);
        return ResponseEntity.ok(ApiResponse.success("Department deleted successfully", null));
    }
}
