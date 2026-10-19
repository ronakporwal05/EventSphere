package com.eventsphere.document.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentCreateRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "File URL is required")
    private String fileUrl;

    @NotBlank(message = "File type is required")
    private String fileType;

    @Min(value = 0, message = "File size cannot be negative")
    private long fileSizeBytes;

    private String category;
}
