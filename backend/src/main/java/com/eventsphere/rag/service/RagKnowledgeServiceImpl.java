package com.eventsphere.rag.service;

import com.eventsphere.ai.provider.EmbeddingProvider;
import com.eventsphere.ai.provider.LlmProvider;
import com.eventsphere.ai.provider.VectorStoreProvider;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.docintel.entity.DocumentChunk;
import com.eventsphere.docintel.repository.DocumentChunkRepository;
import com.eventsphere.rag.dto.Citation;
import com.eventsphere.rag.dto.RagQueryRequest;
import com.eventsphere.rag.dto.RagQueryResponse;
import com.eventsphere.rag.entity.RagQueryLog;
import com.eventsphere.rag.repository.RagQueryLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class RagKnowledgeServiceImpl implements RagKnowledgeService {

    private final EmbeddingProvider embeddingProvider;
    private final VectorStoreProvider vectorStoreProvider;
    private final LlmProvider llmProvider;
    private final DocumentChunkRepository chunkRepository;
    private final RagQueryLogRepository queryLogRepository;

    @Override
    @Transactional
    public RagQueryResponse queryKnowledgeBase(RagQueryRequest request) {
        long startTime = System.currentTimeMillis();
        String tenantId = TenantContext.getTenantId();
        int topK = request.getTopK() > 0 ? request.getTopK() : 3;

        log.info("Executing RAG Knowledge Query for tenant '{}': '{}'", tenantId, request.getQuery());

        // 1. Generate Query Vector Embedding
        float[] queryVector = embeddingProvider.generateEmbedding(request.getQuery());

        // 2. Strict Multi-Tenant Metadata Filter
        Map<String, Object> filterMetadata = new HashMap<>();
        filterMetadata.put("tenant_id", tenantId);
        if (request.getEventId() != null && !request.getEventId().isBlank()) {
            filterMetadata.put("event_id", request.getEventId());
        }

        // 3. Vector Similarity Search
        List<VectorStoreProvider.VectorSearchResult> searchResults = vectorStoreProvider.searchVectors(
                "eventsphere_knowledge", queryVector, topK, filterMetadata);

        // 4. Construct Context & Citations
        StringBuilder contextBuilder = new StringBuilder();
        List<Citation> citations = new ArrayList<>();

        for (VectorStoreProvider.VectorSearchResult res : searchResults) {
            String chunkId = res.id();
            Optional<DocumentChunk> chunkOpt = chunkRepository.findById(chunkId);

            String docName = "Document";
            String snippet = "Context snippet";
            int chunkIndex = 0;

            if (chunkOpt.isPresent()) {
                DocumentChunk chunk = chunkOpt.get();
                docName = chunk.getJob().getDocumentName();
                snippet = chunk.getContent();
                chunkIndex = chunk.getChunkIndex();
            }

            contextBuilder.append(String.format("\n[Source: %s (Chunk %d)]\n%s\n", docName, chunkIndex, snippet));

            citations.add(Citation.builder()
                    .documentName(docName)
                    .chunkId(chunkId)
                    .chunkIndex(chunkIndex)
                    .similarityScore(Math.round(res.score() * 1000.0) / 1000.0)
                    .snippet(snippet)
                    .build());
        }

        // 5. System Prompt Construction
        String systemPrompt = "You are EventSphere AI Knowledge Assistant. Answer the question accurately using ONLY the provided context.\n" +
                "Requirements:\n" +
                "- Every claim MUST cite the source document name.\n" +
                "- If context is insufficient, state that information is missing.\n\n" +
                "CONTEXT:\n" + contextBuilder;

        String userPrompt = request.getQuery();

        // 6. Generate AI Answer with Citations
        LlmProvider.LlmResponse llmResp = llmProvider.generateCompletion(systemPrompt, userPrompt);
        long executionTime = System.currentTimeMillis() - startTime;

        // 7. Audit Logging
        RagQueryLog queryLog = RagQueryLog.builder()
                .tenantId(tenantId)
                .userQuery(request.getQuery())
                .generatedAnswer(llmResp.text())
                .chunksRetrievedCount(citations.size())
                .promptTokensUsed(llmResp.promptTokens())
                .completionTokensUsed(llmResp.completionTokens())
                .executionTimeMs(executionTime)
                .build();
        queryLogRepository.save(queryLog);

        log.info("RAG Query executed in {} ms | Tokens used: P={}, C={}", executionTime, llmResp.promptTokens(), llmResp.completionTokens());

        return RagQueryResponse.builder()
                .answer(llmResp.text())
                .citations(citations)
                .promptTokens(llmResp.promptTokens())
                .completionTokens(llmResp.completionTokens())
                .executionTimeMs(executionTime)
                .build();
    }
}
