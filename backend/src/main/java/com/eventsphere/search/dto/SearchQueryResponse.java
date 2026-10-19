package com.eventsphere.search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchQueryResponse {
    private String query;
    private String entityFilter;
    private int totalResults;
    private long executionTimeMs;
    private List<SearchResultItem> results;
}
