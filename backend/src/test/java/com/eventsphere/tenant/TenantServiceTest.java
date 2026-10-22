package com.eventsphere.tenant;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.tenant.dto.TenantCreateRequest;
import com.eventsphere.tenant.dto.TenantResponse;
import com.eventsphere.tenant.entity.Tenant;
import com.eventsphere.tenant.repository.TenantRepository;
import com.eventsphere.tenant.service.TenantServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TenantServiceTest {

    @Mock
    private TenantRepository tenantRepository;

    @InjectMocks
    private TenantServiceImpl tenantService;

    private TenantCreateRequest createRequest;

    @BeforeEach
    void setUp() {
        createRequest = TenantCreateRequest.builder()
                .name("Acme University")
                .slug("acme-univ")
                .contactEmail("admin@acme.edu")
                .subscriptionTier("PRO")
                .build();
    }

    @Test
    void testCreateTenantSuccess() {
        when(tenantRepository.existsBySlug(anyString())).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class))).thenAnswer(i -> {
            Tenant t = i.getArgument(0);
            t.setId("tenant-123");
            return t;
        });

        TenantResponse response = tenantService.createTenant(createRequest);

        assertNotNull(response);
        assertEquals("acme-univ", response.getSlug());
        assertEquals("Acme University", response.getName());
    }

    @Test
    void testCreateTenantDuplicateSlugThrowsConflict() {
        when(tenantRepository.existsBySlug("acme-univ")).thenReturn(true);

        assertThrows(ResourceConflictException.class, () -> tenantService.createTenant(createRequest));
    }
}
