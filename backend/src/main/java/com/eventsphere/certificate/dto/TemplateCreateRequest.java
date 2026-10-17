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
public class TemplateCreateRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "Template name is required")
    private String name;

    @NotBlank(message = "HTML content is required")
    private String htmlContent;

    private String backgroundUrl;
}
