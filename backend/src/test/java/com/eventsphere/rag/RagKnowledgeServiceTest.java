package com.eventsphere.rag;

import com.eventsphere.ai.provider.EmbeddingProvider;
import com.eventsphere.ai.provider.LlmProvider;
import com.eventsphere.ai.provider.VectorStoreProvider;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.docintel.entity.DocumentChunk;
import com.eventsphere.docintel.entity.DocumentProcessingJob;
import com.eventsphere.docintel.repository.DocumentChunkRepository;
import com.eventsphere.rag.dto.RagQueryRequest;
import com.eventsphere.rag.dto.RagQueryResponse;
import com.eventsphere.rag.entity.RagQueryLog;
import com.eventsphere.rag.repository.RagQueryLogRepository;
import com.eventsphere.rag.service.RagKnowledgeServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RagKnowledgeServiceTest {

    @Mock
    private EmbeddingProvider embeddingProvider;
    @Mock
    private VectorStoreProvider vectorStoreProvider;
    @Mock
    private LlmProvider llmProvider;
    @Mock
    private DocumentChunkRepository chunkRepository;
    @Mock
    private RagQueryLogRepository queryLogRepository;

    @InjectMocks
    private RagKnowledgeServiceImpl ragKnowledgeService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-rag-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testQueryKnowledgeBaseSuccessWithCitations() {
        when(embeddingProvider.generateEmbedding(anyString())).thenReturn(new float[768]);

        VectorStoreProvider.VectorSearchResult mockVecResult = new VectorStoreProvider.VectorSearchResult("chunk-100", 0.92, Map.of("tenant_id", "tenant-rag-1"));
        when(vectorStoreProvider.searchVectors(eq("eventsphere_knowledge"), any(), eq(3), any())).thenReturn(List.of(mockVecResult));

        DocumentProcessingJob mockJob = DocumentProcessingJob.builder().id("job-1").documentName("Event_Manual.pdf").build();
        DocumentChunk mockChunk = DocumentChunk.builder().id("chunk-100").job(mockJob).chunkIndex(0).content("All attendees must wear badges.").build();
        when(chunkRepository.findById("chunk-100")).thenReturn(Optional.of(mockChunk));

        when(llmProvider.generateCompletion(anyString(), anyString())).thenReturn(new LlmProvider.LlmResponse("Attendees must wear badges. References: [Event_Manual.pdf, Chunk 0]", 150, 45));

        RagQueryRequest request = RagQueryRequest.builder()
                .query("What are the badge requirements?")
                .topK(3)
                .build();

        RagQueryResponse response = ragKnowledgeService.queryKnowledgeBase(request);

        assertNotNull(response);
        assertNotNull(response.getAnswer());
        assertFalse(response.getCitations().isEmpty());
        assertEquals("Event_Manual.pdf", response.getCitations().get(0).getDocumentName());
        assertEquals(0.92, response.getCitations().get(0).getSimilarityScore());
        verify(queryLogRepository, times(1)).save(any(RagQueryLog.class));
    }
}
