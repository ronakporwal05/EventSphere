package com.eventsphere.assistant.service;

import com.eventsphere.assistant.dto.*;
import com.eventsphere.assistant.entity.AiConversation;
import com.eventsphere.assistant.entity.AiMessage;
import com.eventsphere.assistant.repository.AiConversationRepository;
import com.eventsphere.assistant.repository.AiMessageRepository;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.rag.dto.RagQueryRequest;
import com.eventsphere.rag.dto.RagQueryResponse;
import com.eventsphere.rag.service.RagKnowledgeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiAssistantServiceImpl implements AiAssistantService {

    private final AiConversationRepository conversationRepository;
    private final AiMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RagKnowledgeService ragKnowledgeService;

    @Override
    @Transactional
    public AssistantChatResponse chat(String currentUserId, AssistantChatRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("AI Event Assistant Chat invoked by user '{}' | Event: '{}'", currentUserId, request.getEventId());

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = null;
        if (request.getEventId() != null && !request.getEventId().isBlank()) {
            event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId).orElse(null);
        }

        // Get or Create Conversation
        AiConversation conversation;
        if (request.getConversationId() != null && !request.getConversationId().isBlank()) {
            conversation = conversationRepository.findByIdAndTenantIdAndUserIdAndDeletedFalse(request.getConversationId(), tenantId, currentUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        } else {
            conversation = AiConversation.builder()
                    .tenantId(tenantId)
                    .event(event)
                    .user(user)
                    .title(request.getMessage().length() > 30 ? request.getMessage().substring(0, 30) + "..." : request.getMessage())
                    .build();
            conversation = conversationRepository.save(conversation);
        }

        // Intent Detection
        String intent = detectIntent(request.getMessage());

        // Save User Message
        AiMessage userMsg = AiMessage.builder()
                .tenantId(tenantId)
                .conversation(conversation)
                .senderRole("USER")
                .content(request.getMessage())
                .intentDetected(intent)
                .build();
        messageRepository.save(userMsg);

        // Delegation to Knowledge RAG Engine
        RagQueryRequest ragReq = RagQueryRequest.builder()
                .eventId(request.getEventId())
                .query(request.getMessage())
                .topK(3)
                .build();
        RagQueryResponse ragResp = ragKnowledgeService.queryKnowledgeBase(ragReq);

        // Save Assistant Message
        AiMessage assistantMsg = AiMessage.builder()
                .tenantId(tenantId)
                .conversation(conversation)
                .senderRole("ASSISTANT")
                .content(ragResp.getAnswer())
                .intentDetected(intent)
                .build();
        AiMessage savedAssistantMsg = messageRepository.save(assistantMsg);

        return AssistantChatResponse.builder()
                .conversationId(conversation.getId())
                .messageId(savedAssistantMsg.getId())
                .answer(ragResp.getAnswer())
                .intentDetected(intent)
                .citations(ragResp.getCitations())
                .build();
    }

    private String detectIntent(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("schedule") || lower.contains("time") || lower.contains("when") || lower.contains("agenda")) {
            return "SCHEDULE_QUERY";
        } else if (lower.contains("speaker") || lower.contains("who is speaking") || lower.contains("keynote")) {
            return "SPEAKER_INFO";
        } else if (lower.contains("check-in") || lower.contains("badge") || lower.contains("attendance") || lower.contains("capacity")) {
            return "OPERATIONS_ASSISTANCE";
        }
        return "GENERAL_QA";
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationResponse> getUserConversations(String currentUserId, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return conversationRepository.findByTenantIdAndUserIdAndDeletedFalse(tenantId, currentUserId, pageable)
                .map(c -> ConversationResponse.builder()
                        .id(c.getId())
                        .eventId(c.getEvent() != null ? c.getEvent().getId() : null)
                        .title(c.getTitle())
                        .createdAt(c.getCreatedAt())
                        .updatedAt(c.getUpdatedAt())
                        .build());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getConversationMessages(String currentUserId, String conversationId) {
        String tenantId = TenantContext.getTenantId();
        conversationRepository.findByIdAndTenantIdAndUserIdAndDeletedFalse(conversationId, tenantId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        return messageRepository.findByTenantIdAndConversationIdOrderByCreatedAtAsc(tenantId, conversationId).stream()
                .map(m -> MessageResponse.builder()
                        .id(m.getId())
                        .senderRole(m.getSenderRole())
                        .content(m.getContent())
                        .intentDetected(m.getIntentDetected())
                        .createdAt(m.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
