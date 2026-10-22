package com.eventsphere.organization;

import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.organization.dto.OrganizationRequest;
import com.eventsphere.organization.dto.OrganizationResponse;
import com.eventsphere.organization.entity.Organization;
import com.eventsphere.organization.repository.DepartmentRepository;
import com.eventsphere.organization.repository.OrganizationRepository;
import com.eventsphere.organization.service.OrganizationServiceImpl;
import org.junit.jupiter.api.AfterEach;
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
class OrganizationServiceTest {

    @Mock
    private OrganizationRepository organizationRepository;
    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private OrganizationServiceImpl organizationService;

    private OrganizationRequest request;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-org-1");
        request = OrganizationRequest.builder()
                .name("Global Tech Corp")
                .legalName("Global Tech Corporation Inc")
                .supportEmail("support@globaltech.com")
                .build();
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testCreateOrganizationSuccess() {
        when(organizationRepository.findByTenantId("tenant-org-1")).thenReturn(Optional.empty());
        when(organizationRepository.save(any(Organization.class))).thenAnswer(i -> {
            Organization o = i.getArgument(0);
            o.setId("org-123");
            return o;
        });

        OrganizationResponse response = organizationService.createOrUpdateOrganization(request);

        assertNotNull(response);
        assertEquals("Global Tech Corp", response.getName());
        assertEquals("tenant-org-1", response.getTenantId());
    }
}
