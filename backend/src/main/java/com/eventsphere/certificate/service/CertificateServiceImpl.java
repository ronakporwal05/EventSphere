package com.eventsphere.certificate.service;

import com.eventsphere.attendance.repository.AttendanceRepository;
import com.eventsphere.certificate.dto.*;
import com.eventsphere.certificate.entity.Certificate;
import com.eventsphere.certificate.entity.CertificateTemplate;
import com.eventsphere.certificate.repository.CertificateRepository;
import com.eventsphere.certificate.repository.CertificateTemplateRepository;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final CertificateTemplateRepository templateRepository;
    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final AttendanceRepository attendanceRepository;

    @Override
    @Transactional
    public TemplateResponse createTemplate(TemplateCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating certificate template '{}' for event '{}'", request.getName(), request.getEventId());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        if (templateRepository.existsByTenantIdAndEventIdAndNameAndDeletedFalse(tenantId, event.getId(), request.getName())) {
            throw new ResourceConflictException("Template with name '" + request.getName() + "' already exists for this event.");
        }

        CertificateTemplate template = CertificateTemplate.builder()
                .tenantId(tenantId)
                .event(event)
                .name(request.getName())
                .htmlContent(request.getHtmlContent())
                .backgroundUrl(request.getBackgroundUrl())
                .active(true)
                .build();

        CertificateTemplate saved = templateRepository.save(template);
        return mapToTemplateResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TemplateResponse> getTemplatesByEvent(String eventId) {
        String tenantId = TenantContext.getTenantId();
        return templateRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId).stream()
                .map(this::mapToTemplateResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CertificateResponse generateCertificate(CertificateGenerateRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Generating certificate for registration '{}'", request.getRegistrationId());

        Registration reg = registrationRepository.findByIdAndTenantIdAndDeletedFalse(request.getRegistrationId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + request.getRegistrationId()));

        CertificateTemplate template = templateRepository.findByIdAndTenantIdAndDeletedFalse(request.getTemplateId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate template not found with ID: " + request.getTemplateId()));

        // Business Rule: Verified Attendee Requirement Check
        boolean verifiedAttendee = attendanceRepository.existsByTenantIdAndEventIdAndTicketIdAndDeletedFalse(tenantId, reg.getEvent().getId(), reg.getId());
        // Also check if any registration ticket has checked in
        if (!verifiedAttendee && !attendanceRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, reg.getEvent().getId(), Pageable.unpaged()).getContent().stream().anyMatch(a -> a.getRegistration().getId().equals(reg.getId()))) {
            throw new ResourceConflictException("CERTIFICATE REJECTED: Certificates can only be issued to verified event attendees who have checked in.");
        }

        if (certificateRepository.existsByTenantIdAndEventIdAndRegistrationIdAndDeletedFalse(tenantId, reg.getEvent().getId(), reg.getId())) {
            throw new ResourceConflictException("Certificate already issued for this registration.");
        }

        String certNum = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String token = UUID.randomUUID().toString();

        Certificate cert = Certificate.builder()
                .tenantId(tenantId)
                .event(reg.getEvent())
                .registration(reg)
                .template(template)
                .certificateNumber(certNum)
                .verificationToken(token)
                .issuedToName(reg.getAttendeeName())
                .issuedToEmail(reg.getAttendeeEmail())
                .status("ISSUED")
                .pdfUrl("/api/v1/certificates/" + certNum + "/pdf")
                .issuedAt(Instant.now())
                .build();

        Certificate saved = certificateRepository.save(cert);
        return mapToCertificateResponse(saved);
    }

    @Override
    @Async
    @Transactional
    public void bulkGenerateCertificates(String eventId, String templateId) {
        String tenantId = TenantContext.getTenantId();
        log.info("Starting ASYNCHRONOUS bulk certificate generation for event '{}'", eventId);

        List<Registration> verifiedAttendees = registrationRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, Pageable.unpaged()).getContent().stream()
                .filter(reg -> attendanceRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, Pageable.unpaged()).getContent().stream().anyMatch(a -> a.getRegistration().getId().equals(reg.getId())))
                .collect(Collectors.toList());

        for (Registration reg : verifiedAttendees) {
            try {
                if (!certificateRepository.existsByTenantIdAndEventIdAndRegistrationIdAndDeletedFalse(tenantId, eventId, reg.getId())) {
                    CertificateGenerateRequest single = CertificateGenerateRequest.builder()
                            .registrationId(reg.getId())
                            .templateId(templateId)
                            .build();
                    generateCertificate(single);
                }
            } catch (Exception e) {
                log.error("Async bulk certificate generation skipped registration '{}': {}", reg.getId(), e.getMessage());
            }
        }
        log.info("Finished ASYNCHRONOUS bulk certificate generation for event '{}'", eventId);
    }

    @Override
    @Transactional(readOnly = true)
    public CertificateVerificationResult verifyCertificate(String token) {
        Certificate cert = certificateRepository.findByVerificationToken(token)
                .orElse(null);

        if (cert == null || "REVOKED".equalsIgnoreCase(cert.getStatus())) {
            return CertificateVerificationResult.builder()
                    .valid(false)
                    .message("INVALID CERTIFICATE: Token not found or certificate has been revoked.")
                    .build();
        }

        return CertificateVerificationResult.builder()
                .valid(true)
                .message("Certificate verified successfully.")
                .certificateNumber(cert.getCertificateNumber())
                .issuedToName(cert.getIssuedToName())
                .issuedToEmail(cert.getIssuedToEmail())
                .eventTitle(cert.getEvent().getTitle())
                .issuedAt(cert.getIssuedAt())
                .build();
    }

    @Override
    @Transactional
    public CertificateResponse reissueCertificate(String id) {
        String tenantId = TenantContext.getTenantId();
        Certificate cert = certificateRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with ID: " + id));

        String newCertNum = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String newToken = UUID.randomUUID().toString();

        cert.setCertificateNumber(newCertNum);
        cert.setVerificationToken(newToken);
        cert.setStatus("REISSUED");
        cert.setIssuedAt(Instant.now());

        Certificate saved = certificateRepository.save(cert);
        log.info("Reissued certificate ID '{}' with new number: {}", id, newCertNum);
        return mapToCertificateResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CertificateResponse getCertificateById(String id) {
        String tenantId = TenantContext.getTenantId();
        Certificate cert = certificateRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with ID: " + id));
        return mapToCertificateResponse(cert);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CertificateResponse> getCertificatesByEvent(String eventId, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return certificateRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, pageable).map(this::mapToCertificateResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadCertificatePdf(String id) {
        String tenantId = TenantContext.getTenantId();
        Certificate cert = certificateRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with ID: " + id));

        String html = cert.getTemplate().getHtmlContent()
                .replace("{{ATTENDEE_NAME}}", cert.getIssuedToName())
                .replace("{{EVENT_TITLE}}", cert.getEvent().getTitle())
                .replace("{{CERTIFICATE_NUMBER}}", cert.getCertificateNumber())
                .replace("{{VERIFICATION_TOKEN}}", cert.getVerificationToken());

        return html.getBytes(StandardCharsets.UTF_8);
    }

    private TemplateResponse mapToTemplateResponse(CertificateTemplate t) {
        return TemplateResponse.builder()
                .id(t.getId())
                .eventId(t.getEvent().getId())
                .name(t.getName())
                .htmlContent(t.getHtmlContent())
                .backgroundUrl(t.getBackgroundUrl())
                .active(t.isActive())
                .createdAt(t.getCreatedAt())
                .build();
    }

    private CertificateResponse mapToCertificateResponse(Certificate c) {
        return CertificateResponse.builder()
                .id(c.getId())
                .eventId(c.getEvent().getId())
                .eventTitle(c.getEvent().getTitle())
                .registrationId(c.getRegistration().getId())
                .templateId(c.getTemplate().getId())
                .certificateNumber(c.getCertificateNumber())
                .verificationToken(c.getVerificationToken())
                .issuedToName(c.getIssuedToName())
                .issuedToEmail(c.getIssuedToEmail())
                .status(c.getStatus())
                .pdfUrl(c.getPdfUrl())
                .issuedAt(c.getIssuedAt())
                .build();
    }
}
