package com.eventsphere.assistant.controller;

import com.eventsphere.assistant.dto.*;
import com.eventsphere.assistant.service.AiAssistantService;
import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai-assistant")
@RequiredArgsConstructor
public class AiAssistantController {

    private final AiAssistantService assistantService;

    @PostMapping("/chat")
    @Auditable(action = "AI_ASSISTANT_CHAT", entityType = "AI_CONVERSATION")
    public ResponseEntity<ApiResponse<AssistantChatResponse>> chat(@Valid @RequestBody AssistantChatRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        AssistantChatResponse response = assistantService.chat(currentUserId, request);
        return ResponseEntity.ok(ApiResponse.success("AI Event Assistant response generated", response));
    }

    @GetMapping("/conversations")
    public ResponseEntity<PagedResponse<ConversationResponse>> getUserConversations(Pageable pageable) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Page<ConversationResponse> page = assistantService.getUserConversations(currentUserId, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Conversations retrieved successfully"));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getConversationMessages(@PathVariable("conversationId") String conversationId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<MessageResponse> messages = assistantService.getConversationMessages(currentUserId, conversationId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }
}
