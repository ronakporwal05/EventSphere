package com.eventsphere.tenant.controller;

import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.tenant.dto.TenantCreateRequest;
import com.eventsphere.tenant.dto.TenantResponse;
import com.eventsphere.tenant.dto.TenantUpdateRequest;
import com.eventsphere.tenant.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TenantResponse>> createTenant(@Valid @RequestBody TenantCreateRequest request) {
        TenantResponse response = tenantService.createTenant(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tenant created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TenantResponse>> getTenantById(@PathVariable("id") String id) {
        TenantResponse response = tenantService.getTenantById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/public/slug/{slug}")
    public ResponseEntity<ApiResponse<TenantResponse>> getTenantBySlug(@PathVariable("slug") String slug) {
        TenantResponse response = tenantService.getTenantBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<PagedResponse<TenantResponse>> getAllTenants(Pageable pageable) {
        Page<TenantResponse> tenants = tenantService.getAllTenants(pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(tenants, "Tenants retrieved successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    public ResponseEntity<ApiResponse<TenantResponse>> updateTenant(@PathVariable("id") String id, @Valid @RequestBody TenantUpdateRequest request) {
        TenantResponse response = tenantService.updateTenant(id, request);
        return ResponseEntity.ok(ApiResponse.success("Tenant updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTenant(@PathVariable("id") String id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.ok(ApiResponse.success("Tenant deleted successfully", null));
    }
}
