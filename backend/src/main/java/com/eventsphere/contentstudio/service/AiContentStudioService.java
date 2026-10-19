package com.eventsphere.contentstudio.service;

import com.eventsphere.contentstudio.dto.ContentGenerateRequest;
import com.eventsphere.contentstudio.dto.ContentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AiContentStudioService {

    ContentResponse generateContentAsset(String currentUserId, ContentGenerateRequest request);

    ContentResponse getContentAssetById(String assetId);

    Page<ContentResponse> getContentAssetsByEvent(String eventId, Pageable pageable);
}
