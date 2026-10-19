package com.eventsphere.search.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.search.dto.SearchQueryRequest;
import com.eventsphere.search.dto.SearchQueryResponse;
import com.eventsphere.search.service.UnifiedSearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class UnifiedSearchController {

    private final UnifiedSearchService searchService;

    @PostMapping
    @Auditable(action = "HYBRID_UNIFIED_SEARCH", entityType = "SEARCH_QUERY")
    public ResponseEntity<ApiResponse<SearchQueryResponse>> executeSearch(@Valid @RequestBody SearchQueryRequest request) {
        SearchQueryResponse response = searchService.executeHybridSearch(request);
        return ResponseEntity.ok(ApiResponse.success("Hybrid search completed", response));
    }
}
