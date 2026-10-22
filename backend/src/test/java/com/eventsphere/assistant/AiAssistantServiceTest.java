package com.eventsphere.assistant;

import com.eventsphere.assistant.dto.AssistantChatRequest;
import com.eventsphere.assistant.dto.AssistantChatResponse;
import com.eventsphere.assistant.entity.AiConversation;
import com.eventsphere.assistant.entity.AiMessage;
import com.eventsphere.assistant.repository.AiConversationRepository;
import com.eventsphere.assistant.repository.AiMessageRepository;
import com.eventsphere.assistant.service.AiAssistantServiceImpl;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.rag.dto.Citation;
import com.eventsphere.rag.dto.RagQueryResponse;
import com.eventsphere.rag.service.RagKnowledgeService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiAssistantServiceTest {

    @Mock
    private AiConversationRepository conversationRepository;
    @Mock
    private AiMessageRepository messageRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private RagKnowledgeService ragKnowledgeService;

    @InjectMocks
    private AiAssistantServiceImpl assistantService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-ast-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testChatNewConversationSuccess() {
        User mockUser = User.builder().id("usr-ast-1").email("attendee@eventsphere.ai").build();
        when(userRepository.findById("usr-ast-1")).thenReturn(Optional.of(mockUser));

        when(conversationRepository.save(any(AiConversation.class))).thenAnswer(i -> {
            AiConversation c = i.getArgument(0);
            c.setId("conv-999");
            return c;
        });

        RagQueryResponse mockRagResp = RagQueryResponse.builder()
                .answer("Keynote speaker starts at 10:00 AM.")
                .citations(List.of(Citation.builder().documentName("Schedule.pdf").similarityScore(0.95).build()))
                .build();
        when(ragKnowledgeService.queryKnowledgeBase(any())).thenReturn(mockRagResp);

        when(messageRepository.save(any(AiMessage.class))).thenAnswer(i -> {
            AiMessage m = i.getArgument(0);
            m.setId("msg-111");
            return m;
        });

        AssistantChatRequest request = AssistantChatRequest.builder()
                .message("What time does the keynote speaker start?")
                .build();

        AssistantChatResponse response = assistantService.chat("usr-ast-1", request);

        assertNotNull(response);
        assertEquals("conv-999", response.getConversationId());
        assertEquals("SCHEDULE_QUERY", response.getIntentDetected());
        assertEquals("Keynote speaker starts at 10:00 AM.", response.getAnswer());
        verify(messageRepository, times(2)).save(any(AiMessage.class));
    }
}
