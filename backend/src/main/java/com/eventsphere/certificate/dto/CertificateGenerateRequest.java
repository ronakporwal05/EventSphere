package com.eventsphere.certificate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateGenerateRequest {

    @NotBlank(message = "Registration ID is required")
    private String registrationId;

    @NotBlank(message = "Template ID is required")
    private String templateId;
}
