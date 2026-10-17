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
public class TemplateResponse {
    private String id;
    private String eventId;
    private String name;
    private String htmlContent;
    private String backgroundUrl;
    private boolean active;
    private Instant createdAt;
}
