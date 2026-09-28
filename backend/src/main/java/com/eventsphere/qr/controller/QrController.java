package com.eventsphere.qr.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.qr.dto.QrGenerateResponse;
import com.eventsphere.qr.dto.QrValidationRequest;
import com.eventsphere.qr.dto.QrValidationResult;
import com.eventsphere.qr.service.QrValidationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/qr")
@RequiredArgsConstructor
public class QrController {

    private final QrValidationService qrValidationService;

    @PostMapping("/generate/{ticketId}")
    @Auditable(action = "GENERATE_SECURE_QR", entityType = "QR")
    public ResponseEntity<ApiResponse<QrGenerateResponse>> generateQrTokenForTicket(@PathVariable("ticketId") String ticketId) {
        QrGenerateResponse response = qrValidationService.generateQrTokenForTicket(ticketId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Secure QR token generated", response));
    }

    @PostMapping("/validate")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER') or hasRole('STAFF')")
    @Auditable(action = "VALIDATE_QR_TOKEN", entityType = "QR")
    public ResponseEntity<ApiResponse<QrValidationResult>> validateQrToken(@Valid @RequestBody QrValidationRequest request) {
        QrValidationResult result = qrValidationService.validateQrToken(request);
        return ResponseEntity.ok(ApiResponse.success("QR validation result", result));
    }
}
