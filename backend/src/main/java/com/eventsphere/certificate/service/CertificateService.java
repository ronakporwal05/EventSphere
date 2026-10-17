package com.eventsphere.certificate.service;

import com.eventsphere.certificate.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CertificateService {

    TemplateResponse createTemplate(TemplateCreateRequest request);

    List<TemplateResponse> getTemplatesByEvent(String eventId);

    CertificateResponse generateCertificate(CertificateGenerateRequest request);

    void bulkGenerateCertificates(String eventId, String templateId);

    CertificateVerificationResult verifyCertificate(String token);

    CertificateResponse reissueCertificate(String id);

    CertificateResponse getCertificateById(String id);

    Page<CertificateResponse> getCertificatesByEvent(String eventId, Pageable pageable);

    byte[] downloadCertificatePdf(String id);
}
