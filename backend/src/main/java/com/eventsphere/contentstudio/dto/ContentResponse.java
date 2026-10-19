package com.eventsphere.contentstudio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentResponse {
    private String id;
    private String eventId;
    private String contentType;
    private String platform;
    private String tone;
    private String title;
    private String generatedText;
    private String createdByEmail;
    private Instant createdAt;
}
