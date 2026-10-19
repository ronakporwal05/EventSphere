package com.eventsphere.search.service;

import com.eventsphere.ai.provider.EmbeddingProvider;
import com.eventsphere.ai.provider.VectorStoreProvider;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.docintel.entity.DocumentChunk;
import com.eventsphere.docintel.repository.DocumentChunkRepository;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.search.dto.SearchQueryRequest;
import com.eventsphere.search.dto.SearchQueryResponse;
import com.eventsphere.search.dto.SearchResultItem;
import com.eventsphere.search.entity.SearchQueryLogEntity;
import com.eventsphere.search.repository.SearchQueryLogEntityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UnifiedSearchServiceImpl implements UnifiedSearchService {

    private final EventRepository eventRepository;
    private final DocumentChunkRepository chunkRepository;
    private final EmbeddingProvider embeddingProvider;
    private final VectorStoreProvider vectorStoreProvider;
    private final SearchQueryLogEntityRepository logRepository;

    @Override
    @Transactional
    public SearchQueryResponse executeHybridSearch(SearchQueryRequest request) {
        long startTime = System.currentTimeMillis();
        String tenantId = TenantContext.getTenantId();
        int limit = request.getLimit() > 0 ? request.getLimit() : 10;
        String filter = request.getEntityFilter() != null ? request.getEntityFilter().toUpperCase() : "ALL";

        log.info("Executing Hybrid Unified Search for tenant '{}': query='{}', filter='{}'", tenantId, request.getQuery(), filter);

        List<SearchResultItem> results = new ArrayList<>();

        // 1. Keyword DB Search for Events
        if ("ALL".equals(filter) || "EVENT".equals(filter)) {
            List<Event> matchedEvents = eventRepository.findByTenantIdAndDeletedFalse(tenantId, PageRequest.of(0, limit)).getContent();
            for (Event e : matchedEvents) {
                if (e.getTitle().toLowerCase().contains(request.getQuery().toLowerCase()) ||
                        (e.getDescription() != null && e.getDescription().toLowerCase().contains(request.getQuery().toLowerCase()))) {
                    results.add(SearchResultItem.builder()
                            .entityId(e.getId())
                            .entityType("EVENT")
                            .title(e.getTitle())
                            .snippet(e.getDescription() != null ? e.getDescription() : "Event listing")
                            .relevanceScore(0.95)
                            .source("KEYWORD_DB")
                            .build());
                }
            }
        }

        // 2. Vector Semantic Search for Documents
        if ("ALL".equals(filter) || "DOCUMENT".equals(filter)) {
            try {
                float[] queryVec = embeddingProvider.generateEmbedding(request.getQuery());
                Map<String, Object> filterMeta = Map.of("tenant_id", tenantId);

                List<VectorStoreProvider.VectorSearchResult> vecResults = vectorStoreProvider.searchVectors(
                        "eventsphere_knowledge", queryVec, limit, filterMeta);

                for (VectorStoreProvider.VectorSearchResult vr : vecResults) {
                    Optional<DocumentChunk> chunkOpt = chunkRepository.findById(vr.id());
                    if (chunkOpt.isPresent()) {
                        DocumentChunk chunk = chunkOpt.get();
                        results.add(SearchResultItem.builder()
                                .entityId(chunk.getJob().getId())
                                .entityType("DOCUMENT")
                                .title(chunk.getJob().getDocumentName())
                                .snippet(chunk.getContent())
                                .relevanceScore(Math.round(vr.score() * 100.0) / 100.0)
                                .source("VECTOR_STORE")
                                .build());
                    }
                }
            } catch (Exception ex) {
                log.warn("Vector search fallback triggered during hybrid search execution: {}", ex.getMessage());
            }
        }

        // 3. Rerank & Limit Results
        results.sort(Comparator.comparingDouble(SearchResultItem::getRelevanceScore).reversed());
        if (results.size() > limit) {
            results = results.subList(0, limit);
        }

        long executionTime = System.currentTimeMillis() - startTime;

        // 4. Audit Logging
        SearchQueryLogEntity logEntity = SearchQueryLogEntity.builder()
                .tenantId(tenantId)
                .queryText(request.getQuery())
                .entityFilter(filter)
                .resultsFoundCount(results.size())
                .executionTimeMs(executionTime)
                .build();
        logRepository.save(logEntity);

        return SearchQueryResponse.builder()
                .query(request.getQuery())
                .entityFilter(filter)
                .totalResults(results.size())
                .executionTimeMs(executionTime)
                .results(results)
                .build();
    }
}
