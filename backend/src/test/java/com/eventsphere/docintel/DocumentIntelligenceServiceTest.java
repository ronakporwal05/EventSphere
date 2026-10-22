package com.eventsphere.docintel;

import com.eventsphere.ai.provider.EmbeddingProvider;
import com.eventsphere.ai.provider.VectorStoreProvider;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.docintel.dto.DocumentIngestRequest;
import com.eventsphere.docintel.dto.DocumentJobResponse;
import com.eventsphere.docintel.entity.DocumentProcessingJob;
import com.eventsphere.docintel.repository.DocumentChunkRepository;
import com.eventsphere.docintel.repository.DocumentProcessingJobRepository;
import com.eventsphere.docintel.service.DocumentIntelligenceServiceImpl;
import com.eventsphere.event.repository.EventRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocumentIntelligenceServiceTest {

    @Mock
    private DocumentProcessingJobRepository jobRepository;
    @Mock
    private DocumentChunkRepository chunkRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private EmbeddingProvider embeddingProvider;
    @Mock
    private VectorStoreProvider vectorStoreProvider;

    @InjectMocks
    private DocumentIntelligenceServiceImpl docIntelService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-ai-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testProcessAndIngestDocumentSuccess() {
        when(jobRepository.save(any(DocumentProcessingJob.class))).thenAnswer(i -> {
            DocumentProcessingJob j = i.getArgument(0);
            if (j.getId() == null) j.setId("job-ai-100");
            return j;
        });

        when(embeddingProvider.generateEmbedding(anyString())).thenReturn(new float[768]);

        DocumentIngestRequest request = DocumentIngestRequest.builder()
                .documentName("Speaker_Guidelines.pdf")
                .fileType("PDF")
                .rawTextContent("Welcome to EventSphere AI Summit. Speakers must arrive 15 minutes before session time.")
                .chunkSize(100)
                .chunkOverlap(10)
                .build();

        DocumentJobResponse response = docIntelService.processAndIngestDocument(request);

        assertNotNull(response);
        assertEquals("COMPLETED", response.getStatus());
        assertTrue(response.getTotalChunks() > 0);
        verify(chunkRepository, times(1)).saveAll(any());
        verify(vectorStoreProvider, atLeastOnce()).storeVector(anyString(), anyString(), any(), any());
    }
}
