package com.eventsphere.search.service;

import com.eventsphere.search.dto.SearchQueryRequest;
import com.eventsphere.search.dto.SearchQueryResponse;

public interface UnifiedSearchService {

    SearchQueryResponse executeHybridSearch(SearchQueryRequest request);
}
