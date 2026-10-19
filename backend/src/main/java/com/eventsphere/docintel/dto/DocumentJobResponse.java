package com.eventsphere.docintel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentJobResponse {
    private String id;
    private String eventId;
    private String documentName;
    private String fileType;
    private long fileSizeBytes;
    private String status;
    private int totalChunks;
    private String errorMessage;
    private Instant processedAt;
    private Instant createdAt;
}
