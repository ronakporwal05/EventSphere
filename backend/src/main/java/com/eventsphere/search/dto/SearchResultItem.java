package com.eventsphere.search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultItem {
    private String entityId;
    private String entityType; // EVENT, DOCUMENT, SPEAKER, SESSION, CERTIFICATE
    private String title;
    private String snippet;
    private double relevanceScore;
    private String source; // KEYWORD_DB, VECTOR_STORE, HYBRID
}
