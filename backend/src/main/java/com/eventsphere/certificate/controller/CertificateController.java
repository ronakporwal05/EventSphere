package com.eventsphere.certificate.controller;

import com.eventsphere.certificate.dto.*;
import com.eventsphere.certificate.service.CertificateService;
import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/templates")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CREATE_CERTIFICATE_TEMPLATE", entityType = "CERTIFICATE_TEMPLATE")
    public ResponseEntity<ApiResponse<TemplateResponse>> createTemplate(@Valid @RequestBody TemplateCreateRequest request) {
        TemplateResponse response = certificateService.createTemplate(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Certificate template created successfully", response));
    }

    @GetMapping("/templates/event/{eventId}")
    public ResponseEntity<ApiResponse<List<TemplateResponse>>> getTemplatesByEvent(@PathVariable("eventId") String eventId) {
        List<TemplateResponse> templates = certificateService.getTemplatesByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "GENERATE_SINGLE_CERTIFICATE", entityType = "CERTIFICATE")
    public ResponseEntity<ApiResponse<CertificateResponse>> generateCertificate(@Valid @RequestBody CertificateGenerateRequest request) {
        CertificateResponse response = certificateService.generateCertificate(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Certificate generated successfully", response));
    }

    @PostMapping("/bulk-generate")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "BULK_GENERATE_CERTIFICATES", entityType = "CERTIFICATE")
    public ResponseEntity<ApiResponse<Void>> bulkGenerateCertificates(
            @RequestParam("eventId") String eventId,
            @RequestParam("templateId") String templateId) {
        certificateService.bulkGenerateCertificates(eventId, templateId);
        return ResponseEntity.accepted()
                .body(ApiResponse.success("Asynchronous bulk certificate generation job initiated", null));
    }

    @GetMapping("/verify/{token}")
    public ResponseEntity<ApiResponse<CertificateVerificationResult>> verifyCertificate(@PathVariable("token") String token) {
        CertificateVerificationResult result = certificateService.verifyCertificate(token);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/{id}/reissue")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "REISSUE_CERTIFICATE", entityType = "CERTIFICATE")
    public ResponseEntity<ApiResponse<CertificateResponse>> reissueCertificate(@PathVariable("id") String id) {
        CertificateResponse response = certificateService.reissueCertificate(id);
        return ResponseEntity.ok(ApiResponse.success("Certificate reissued successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CertificateResponse>> getCertificateById(@PathVariable("id") String id) {
        CertificateResponse response = certificateService.getCertificateById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<PagedResponse<CertificateResponse>> getCertificatesByEvent(@PathVariable("eventId") String eventId, Pageable pageable) {
        Page<CertificateResponse> page = certificateService.getCertificatesByEvent(eventId, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Certificates retrieved successfully"));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadCertificatePdf(@PathVariable("id") String id) {
        byte[] pdfBytes = certificateService.downloadCertificatePdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
