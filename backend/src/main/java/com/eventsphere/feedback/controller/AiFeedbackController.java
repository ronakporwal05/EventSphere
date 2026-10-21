package com.eventsphere.feedback.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.feedback.dto.*;
import com.eventsphere.feedback.service.AiFeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai-feedback")
@RequiredArgsConstructor
public class AiFeedbackController {

    private final AiFeedbackService feedbackService;

    @PostMapping("/submit")
    @Auditable(action = "SUBMIT_FEEDBACK", entityType = "EVENT_FEEDBACK")
    public ResponseEntity<ApiResponse<FeedbackResponse>> submitFeedback(@Valid @RequestBody FeedbackSubmitRequest request) {
        FeedbackResponse response = feedbackService.submitFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Feedback submitted and sentiment classified successfully", response));
    }

    @GetMapping("/sentiment/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<ApiResponse<FeedbackSentimentResponse>> analyzeEventFeedbackSentiment(@PathVariable("eventId") String eventId) {
        FeedbackSentimentResponse response = feedbackService.analyzeEventFeedbackSentiment(eventId);
        return ResponseEntity.ok(ApiResponse.success("AI feedback sentiment analysis computed", response));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<PagedResponse<FeedbackResponse>> getFeedbackByEvent(@PathVariable("eventId") String eventId, Pageable pageable) {
        Page<FeedbackResponse> page = feedbackService.getFeedbackByEvent(eventId, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Feedback records retrieved successfully"));
    }
}
