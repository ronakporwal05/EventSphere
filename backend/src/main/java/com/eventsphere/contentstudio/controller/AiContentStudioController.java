package com.eventsphere.contentstudio.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.contentstudio.dto.ContentGenerateRequest;
import com.eventsphere.contentstudio.dto.ContentResponse;
import com.eventsphere.contentstudio.service.AiContentStudioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai-content-studio")
@RequiredArgsConstructor
public class AiContentStudioController {

    private final AiContentStudioService contentStudioService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "GENERATE_CONTENT_ASSET", entityType = "GENERATED_CONTENT_ASSET")
    public ResponseEntity<ApiResponse<ContentResponse>> generateContentAsset(@Valid @RequestBody ContentGenerateRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        ContentResponse response = contentStudioService.generateContentAsset(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("AI Content asset generated successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<ApiResponse<ContentResponse>> getContentAssetById(@PathVariable("id") String id) {
        ContentResponse response = contentStudioService.getContentAssetById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<PagedResponse<ContentResponse>> getContentAssetsByEvent(@PathVariable("eventId") String eventId, Pageable pageable) {
        Page<ContentResponse> page = contentStudioService.getContentAssetsByEvent(eventId, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Content assets retrieved successfully"));
    }
}
