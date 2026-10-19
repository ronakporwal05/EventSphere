package com.eventsphere.search.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchQueryRequest {

    @NotBlank(message = "Search query is required")
    private String query;

    private String entityFilter; // ALL, EVENT, DOCUMENT, SPEAKER, SESSION, CERTIFICATE

    private int limit; // Default 10
}
