package com.eventsphere.contentstudio;

import com.eventsphere.ai.provider.LlmProvider;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.contentstudio.dto.ContentGenerateRequest;
import com.eventsphere.contentstudio.dto.ContentResponse;
import com.eventsphere.contentstudio.entity.GeneratedContentAsset;
import com.eventsphere.contentstudio.repository.GeneratedContentAssetRepository;
import com.eventsphere.contentstudio.service.AiContentStudioServiceImpl;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiContentStudioServiceTest {

    @Mock
    private GeneratedContentAssetRepository assetRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private LlmProvider llmProvider;

    @InjectMocks
    private AiContentStudioServiceImpl contentStudioService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-cs-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testGenerateContentAssetSuccess() {
        Event mockEvent = Event.builder().id("evt-cs-1").tenantId("tenant-cs-1").title("AI Innovations Conference").build();
        User mockUser = User.builder().id("usr-cs-1").email("marketer@eventsphere.ai").build();

        when(eventRepository.findByIdAndTenantId("evt-cs-1", "tenant-cs-1")).thenReturn(Optional.of(mockEvent));
        when(userRepository.findById("usr-cs-1")).thenReturn(Optional.of(mockUser));

        when(llmProvider.generateCompletion(anyString(), anyString())).thenReturn(new LlmProvider.LlmResponse("🚀 Join us at AI Innovations Conference! Register now.", 80, 25));

        when(assetRepository.save(any(GeneratedContentAsset.class))).thenAnswer(i -> {
            GeneratedContentAsset a = i.getArgument(0);
            a.setId("asset-100");
            return a;
        });

        ContentGenerateRequest request = ContentGenerateRequest.builder()
                .eventId("evt-cs-1")
                .contentType("SOCIAL_POST")
                .platform("LINKEDIN")
                .tone("ENERGETIC")
                .promptDetails("Promote early bird tickets ending this Friday.")
                .build();

        ContentResponse response = contentStudioService.generateContentAsset("usr-cs-1", request);

        assertNotNull(response);
        assertEquals("asset-100", response.getId());
        assertEquals("SOCIAL_POST", response.getContentType());
        assertEquals("LINKEDIN", response.getPlatform());
        assertEquals("ENERGETIC", response.getTone());
        verify(assetRepository, times(1)).save(any(GeneratedContentAsset.class));
    }
}
