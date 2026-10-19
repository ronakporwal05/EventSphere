package com.eventsphere.rag.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagQueryRequest {

    private String eventId;

    @NotBlank(message = "Query text is required")
    private String query;

    private int topK; // Default 3
}
