package com.eventsphere.document.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    private String id;
    private String eventId;
    private String fileName;
    private String fileUrl;
    private String fileType;
    private long fileSizeBytes;
    private String category;
    private Instant createdAt;
}
