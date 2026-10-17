package com.eventsphere.certificate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateVerificationResult {
    private boolean valid;
    private String message;
    private String certificateNumber;
    private String issuedToName;
    private String issuedToEmail;
    private String eventTitle;
    private Instant issuedAt;
}
