package com.eventsphere.rag.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.rag.dto.RagQueryRequest;
import com.eventsphere.rag.dto.RagQueryResponse;
import com.eventsphere.rag.service.RagKnowledgeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rag")
@RequiredArgsConstructor
public class RagKnowledgeController {

    private final RagKnowledgeService ragKnowledgeService;

    @PostMapping("/query")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER') or hasRole('STAFF')")
    @Auditable(action = "RAG_KNOWLEDGE_QUERY", entityType = "RAG_QUERY")
    public ResponseEntity<ApiResponse<RagQueryResponse>> queryKnowledgeBase(@Valid @RequestBody RagQueryRequest request) {
        RagQueryResponse response = ragKnowledgeService.queryKnowledgeBase(request);
        return ResponseEntity.ok(ApiResponse.success("RAG Knowledge query processed successfully with citations", response));
    }
}
