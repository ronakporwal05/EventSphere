package com.eventsphere.certificate;

import com.eventsphere.attendance.entity.Attendance;
import com.eventsphere.attendance.repository.AttendanceRepository;
import com.eventsphere.certificate.dto.CertificateGenerateRequest;
import com.eventsphere.certificate.dto.CertificateResponse;
import com.eventsphere.certificate.dto.CertificateVerificationResult;
import com.eventsphere.certificate.entity.Certificate;
import com.eventsphere.certificate.entity.CertificateTemplate;
import com.eventsphere.certificate.repository.CertificateRepository;
import com.eventsphere.certificate.repository.CertificateTemplateRepository;
import com.eventsphere.certificate.service.CertificateServiceImpl;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.repository.RegistrationRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CertificateServiceTest {

    @Mock
    private CertificateRepository certificateRepository;
    @Mock
    private CertificateTemplateRepository templateRepository;
    @Mock
    private RegistrationRepository registrationRepository;
    @Mock
    private AttendanceRepository attendanceRepository;

    @InjectMocks
    private CertificateServiceImpl certificateService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-cert-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testGenerateCertificateSuccess() {
        Event mockEvent = Event.builder().id("evt-cert-1").tenantId("tenant-cert-1").title("Tech Conference 2026").build();
        Registration mockReg = Registration.builder().id("reg-cert-1").tenantId("tenant-cert-1").event(mockEvent).attendeeName("Grace Hopper").attendeeEmail("grace@navy.mil").build();
        CertificateTemplate mockTpl = CertificateTemplate.builder().id("tpl-cert-1").tenantId("tenant-cert-1").name("Standard Cert").htmlContent("<h1>Certificate</h1>").build();

        Attendance mockAtt = Attendance.builder().id("att-1").tenantId("tenant-cert-1").event(mockEvent).registration(mockReg).build();

        when(registrationRepository.findByIdAndTenantIdAndDeletedFalse("reg-cert-1", "tenant-cert-1")).thenReturn(Optional.of(mockReg));
        when(templateRepository.findByIdAndTenantIdAndDeletedFalse("tpl-cert-1", "tenant-cert-1")).thenReturn(Optional.of(mockTpl));
        when(attendanceRepository.findByTenantIdAndEventIdAndDeletedFalse(eq("tenant-cert-1"), eq("evt-cert-1"), any(Pageable.class))).thenReturn(new PageImpl<>(List.of(mockAtt)));

        when(certificateRepository.save(any(Certificate.class))).thenAnswer(i -> {
            Certificate c = i.getArgument(0);
            c.setId("cert-999");
            return c;
        });

        CertificateGenerateRequest request = CertificateGenerateRequest.builder()
                .registrationId("reg-cert-1")
                .templateId("tpl-cert-1")
                .build();

        CertificateResponse response = certificateService.generateCertificate(request);

        assertNotNull(response);
        assertEquals("Grace Hopper", response.getIssuedToName());
        assertTrue(response.getCertificateNumber().startsWith("CERT-"));
    }

    @Test
    void testGenerateCertificateFailsUnverifiedAttendee() {
        Event mockEvent = Event.builder().id("evt-cert-1").tenantId("tenant-cert-1").title("Tech Conference 2026").build();
        Registration mockReg = Registration.builder().id("reg-cert-1").tenantId("tenant-cert-1").event(mockEvent).build();
        CertificateTemplate mockTpl = CertificateTemplate.builder().id("tpl-cert-1").tenantId("tenant-cert-1").build();

        when(registrationRepository.findByIdAndTenantIdAndDeletedFalse("reg-cert-1", "tenant-cert-1")).thenReturn(Optional.of(mockReg));
        when(templateRepository.findByIdAndTenantIdAndDeletedFalse("tpl-cert-1", "tenant-cert-1")).thenReturn(Optional.of(mockTpl));
        when(attendanceRepository.findByTenantIdAndEventIdAndDeletedFalse(eq("tenant-cert-1"), eq("evt-cert-1"), any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));

        CertificateGenerateRequest request = CertificateGenerateRequest.builder()
                .registrationId("reg-cert-1")
                .templateId("tpl-cert-1")
                .build();

        assertThrows(ResourceConflictException.class, () -> certificateService.generateCertificate(request));
    }
}
