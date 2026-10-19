package com.eventsphere.recommendation.controller;

import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.recommendation.dto.*;
import com.eventsphere.recommendation.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventRecommendation>>> getRecommendedEvents() {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<EventRecommendation> recs = recommendationService.getRecommendedEvents(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Recommended events computed", recs));
    }

    @GetMapping("/sessions/event/{eventId}")
    public ResponseEntity<ApiResponse<List<SessionRecommendation>>> getRecommendedSessions(@PathVariable("eventId") String eventId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<SessionRecommendation> recs = recommendationService.getRecommendedSessions(currentUserId, eventId);
        return ResponseEntity.ok(ApiResponse.success("Recommended sessions computed", recs));
    }

    @GetMapping("/networking/event/{eventId}")
    public ResponseEntity<ApiResponse<List<NetworkingRecommendation>>> getNetworkingRecommendations(@PathVariable("eventId") String eventId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<NetworkingRecommendation> recs = recommendationService.getNetworkingRecommendations(currentUserId, eventId);
        return ResponseEntity.ok(ApiResponse.success("Networking recommendations computed", recs));
    }
}
