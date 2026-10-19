package com.eventsphere.assistant.service;

import com.eventsphere.assistant.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AiAssistantService {

    AssistantChatResponse chat(String currentUserId, AssistantChatRequest request);

    Page<ConversationResponse> getUserConversations(String currentUserId, Pageable pageable);

    List<MessageResponse> getConversationMessages(String currentUserId, String conversationId);
}
