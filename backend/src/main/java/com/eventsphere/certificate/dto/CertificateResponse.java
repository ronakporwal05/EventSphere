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
public class CertificateResponse {
    private String id;
    private String eventId;
    private String eventTitle;
    private String registrationId;
    private String templateId;
    private String certificateNumber;
    private String verificationToken;
    private String issuedToName;
    private String issuedToEmail;
    private String status;
    private String pdfUrl;
    private Instant issuedAt;
}
