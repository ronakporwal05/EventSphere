package com.eventsphere.docintel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentIngestRequest {

    private String eventId;

    @NotBlank(message = "Document name is required")
    private String documentName;

    @NotBlank(message = "File type is required (PDF, DOCX, TXT, MD)")
    private String fileType;

    @NotBlank(message = "Raw text content is required")
    private String rawTextContent;

    private int chunkSize; // Default e.g. 500 chars

    private int chunkOverlap; // Default e.g. 50 chars
}
