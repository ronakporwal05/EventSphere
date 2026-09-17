package com.eventsphere.tenant.service;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.tenant.dto.TenantCreateRequest;
import com.eventsphere.tenant.dto.TenantResponse;
import com.eventsphere.tenant.dto.TenantUpdateRequest;
import com.eventsphere.tenant.entity.Tenant;
import com.eventsphere.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantServiceImpl implements TenantService {

    private final TenantRepository tenantRepository;

    @Override
    @Transactional
    public TenantResponse createTenant(TenantCreateRequest request) {
        log.info("Creating tenant with slug: {}", request.getSlug());

        if (tenantRepository.existsBySlug(request.getSlug())) {
            throw new ResourceConflictException("Tenant with slug '" + request.getSlug() + "' already exists");
        }

        Tenant tenant = Tenant.builder()
                .name(request.getName())
                .slug(request.getSlug().toLowerCase().trim())
                .contactEmail(request.getContactEmail())
                .logoUrl(request.getLogoUrl())
                .subscriptionTier(request.getSubscriptionTier() != null ? request.getSubscriptionTier() : "FREE")
                .status("ACTIVE")
                .themeConfig(request.getThemeConfig())
                .build();

        Tenant savedTenant = tenantRepository.save(tenant);
        return mapToResponse(savedTenant);
    }

    @Override
    @Transactional(readOnly = true)
    public TenantResponse getTenantById(String id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with ID: " + id));
        return mapToResponse(tenant);
    }

    @Override
    @Transactional(readOnly = true)
    public TenantResponse getTenantBySlug(String slug) {
        Tenant tenant = tenantRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with slug: " + slug));
        return mapToResponse(tenant);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TenantResponse> getAllTenants(Pageable pageable) {
        return tenantRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public TenantResponse updateTenant(String id, TenantUpdateRequest request) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with ID: " + id));

        if (request.getName() != null) tenant.setName(request.getName());
        if (request.getLogoUrl() != null) tenant.setLogoUrl(request.getLogoUrl());
        if (request.getContactEmail() != null) tenant.setContactEmail(request.getContactEmail());
        if (request.getSubscriptionTier() != null) tenant.setSubscriptionTier(request.getSubscriptionTier());
        if (request.getStatus() != null) tenant.setStatus(request.getStatus());
        if (request.getThemeConfig() != null) tenant.setThemeConfig(request.getThemeConfig());

        Tenant updated = tenantRepository.save(tenant);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTenant(String id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with ID: " + id));
        tenant.setStatus("DELETED");
        tenantRepository.save(tenant);
        log.info("Soft-deleted tenant with ID: {}", id);
    }

    private TenantResponse mapToResponse(Tenant tenant) {
        return TenantResponse.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .slug(tenant.getSlug())
                .logoUrl(tenant.getLogoUrl())
                .contactEmail(tenant.getContactEmail())
                .subscriptionTier(tenant.getSubscriptionTier())
                .status(tenant.getStatus())
                .themeConfig(tenant.getThemeConfig())
                .createdAt(tenant.getCreatedAt())
                .updatedAt(tenant.getUpdatedAt())
                .build();
    }
}
