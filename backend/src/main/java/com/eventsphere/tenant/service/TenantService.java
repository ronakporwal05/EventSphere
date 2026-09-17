package com.eventsphere.tenant.service;

import com.eventsphere.tenant.dto.TenantCreateRequest;
import com.eventsphere.tenant.dto.TenantResponse;
import com.eventsphere.tenant.dto.TenantUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TenantService {

    TenantResponse createTenant(TenantCreateRequest request);

    TenantResponse getTenantById(String id);

    TenantResponse getTenantBySlug(String slug);

    Page<TenantResponse> getAllTenants(Pageable pageable);

    TenantResponse updateTenant(String id, TenantUpdateRequest request);

    void deleteTenant(String id);
}
