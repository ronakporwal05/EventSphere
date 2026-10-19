package com.eventsphere.contentstudio.service;

import com.eventsphere.ai.provider.LlmProvider;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.contentstudio.dto.ContentGenerateRequest;
import com.eventsphere.contentstudio.dto.ContentResponse;
import com.eventsphere.contentstudio.entity.GeneratedContentAsset;
import com.eventsphere.contentstudio.repository.GeneratedContentAssetRepository;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiContentStudioServiceImpl implements AiContentStudioService {

    private final GeneratedContentAssetRepository assetRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final LlmProvider llmProvider;

    @Override
    @Transactional
    public ContentResponse generateContentAsset(String currentUserId, ContentGenerateRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Generating AI Content Asset (Type: {}, Platform: {}) for tenant '{}'", request.getContentType(), request.getPlatform(), tenantId);

        Event event = null;
        if (request.getEventId() != null && !request.getEventId().isBlank()) {
            event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId).orElse(null);
        }

        User user = userRepository.findById(currentUserId).orElse(null);

        String contentType = request.getContentType().toUpperCase();
        String platform = request.getPlatform() != null ? request.getPlatform().toUpperCase() : "GENERAL";
        String tone = request.getTone() != null ? request.getTone().toUpperCase() : "PROFESSIONAL";

        String systemPrompt = String.format("You are EventSphere AI Copywriter specializing in event marketing. " +
                "Generate a high-converting %s asset for %s in a %s tone.", contentType, platform, tone);

        String eventTitle = event != null ? event.getTitle() : "EventSphere AI Conference";
        String userPrompt = "Event Title: " + eventTitle + "\nDetails: " + request.getPromptDetails();

        LlmProvider.LlmResponse llmResp = llmProvider.generateCompletion(systemPrompt, userPrompt);

        String title = contentType + " - " + platform + " (" + tone + ")";

        GeneratedContentAsset asset = GeneratedContentAsset.builder()
                .tenantId(tenantId)
                .event(event)
                .contentType(contentType)
                .platform(platform)
                .tone(tone)
                .title(title)
                .generatedText(llmResp.text())
                .createdByUser(user)
                .build();

        GeneratedContentAsset saved = assetRepository.save(asset);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ContentResponse getContentAssetById(String assetId) {
        String tenantId = TenantContext.getTenantId();
        GeneratedContentAsset asset = assetRepository.findByIdAndTenantIdAndDeletedFalse(assetId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Content asset not found"));
        return mapToResponse(asset);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContentResponse> getContentAssetsByEvent(String eventId, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return assetRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, pageable).map(this::mapToResponse);
    }

    private ContentResponse mapToResponse(GeneratedContentAsset a) {
        return ContentResponse.builder()
                .id(a.getId())
                .eventId(a.getEvent() != null ? a.getEvent().getId() : null)
                .contentType(a.getContentType())
                .platform(a.getPlatform())
                .tone(a.getTone())
                .title(a.getTitle())
                .generatedText(a.getGeneratedText())
                .createdByEmail(a.getCreatedByUser() != null ? a.getCreatedByUser().getEmail() : "SYSTEM")
                .createdAt(a.getCreatedAt())
                .build();
    }
}
