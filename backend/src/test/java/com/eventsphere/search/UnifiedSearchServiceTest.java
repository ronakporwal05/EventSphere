package com.eventsphere.search;

import com.eventsphere.ai.provider.EmbeddingProvider;
import com.eventsphere.ai.provider.VectorStoreProvider;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.docintel.repository.DocumentChunkRepository;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.search.dto.SearchQueryRequest;
import com.eventsphere.search.dto.SearchQueryResponse;
import com.eventsphere.search.repository.SearchQueryLogEntityRepository;
import com.eventsphere.search.service.UnifiedSearchServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UnifiedSearchServiceTest {

    @Mock
    private EventRepository eventRepository;
    @Mock
    private DocumentChunkRepository chunkRepository;
    @Mock
    private EmbeddingProvider embeddingProvider;
    @Mock
    private VectorStoreProvider vectorStoreProvider;
    @Mock
    private SearchQueryLogEntityRepository logRepository;

    @InjectMocks
    private UnifiedSearchServiceImpl searchService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-sch-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testExecuteHybridSearchSuccess() {
        Event mockEvent = Event.builder().id("evt-sch-1").tenantId("tenant-sch-1").title("AI Architecture Workshop").description("Deep dive into Spring AI.").build();
        when(eventRepository.findByTenantIdAndDeletedFalse(eq("tenant-sch-1"), any())).thenReturn(new PageImpl<>(List.of(mockEvent)));
        when(embeddingProvider.generateEmbedding(anyString())).thenReturn(new float[768]);

        SearchQueryRequest request = SearchQueryRequest.builder()
                .query("Architecture")
                .entityFilter("ALL")
                .limit(5)
                .build();

        SearchQueryResponse response = searchService.executeHybridSearch(request);

        assertNotNull(response);
        assertEquals("Architecture", response.getQuery());
        assertTrue(response.getTotalResults() > 0);
        assertEquals("evt-sch-1", response.getResults().get(0).getEntityId());
        verify(logRepository, times(1)).save(any());
    }
}
