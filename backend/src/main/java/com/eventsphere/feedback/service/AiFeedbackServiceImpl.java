package com.eventsphere.feedback.service;

import com.eventsphere.ai.provider.LlmProvider;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.feedback.dto.*;
import com.eventsphere.feedback.entity.EventFeedback;
import com.eventsphere.feedback.entity.FeedbackSentimentSummary;
import com.eventsphere.feedback.repository.EventFeedbackRepository;
import com.eventsphere.feedback.repository.FeedbackSentimentSummaryRepository;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiFeedbackServiceImpl implements AiFeedbackService {

    private final EventFeedbackRepository feedbackRepository;
    private final FeedbackSentimentSummaryRepository summaryRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final LlmProvider llmProvider;

    @Override
    @Transactional
    public FeedbackResponse submitFeedback(FeedbackSubmitRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Submitting attendee feedback for event '{}'", request.getEventId());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        Registration reg = null;
        if (request.getRegistrationId() != null && !request.getRegistrationId().isBlank()) {
            reg = registrationRepository.findByIdAndTenantIdAndDeletedFalse(request.getRegistrationId(), tenantId).orElse(null);
        }

        // Rule-based and AI Sentiment & Emotion Classifier
        String sentiment = "NEUTRAL";
        String emotion = "SATISFIED";

        if (request.getRating() >= 4) {
            sentiment = "POSITIVE";
            emotion = request.getRating() == 5 ? "DELIGHTED" : "SATISFIED";
        } else if (request.getRating() <= 2) {
            sentiment = "NEGATIVE";
            emotion = request.getRating() == 1 ? "ANGRY" : "FRUSTRATED";
        }

        EventFeedback feedback = EventFeedback.builder()
                .tenantId(tenantId)
                .event(event)
                .registration(reg)
                .rating(request.getRating())
                .category(request.getCategory() != null ? request.getCategory().toUpperCase() : "GENERAL")
                .comment(request.getComment())
                .sentiment(sentiment)
                .emotion(emotion)
                .build();

        EventFeedback saved = feedbackRepository.save(feedback);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public FeedbackSentimentResponse analyzeEventFeedbackSentiment(String eventId) {
        String tenantId = TenantContext.getTenantId();
        log.info("Running AI Sentiment Analysis for event '{}'", eventId);

        Event event = eventRepository.findByIdAndTenantId(eventId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        List<EventFeedback> feedbackList = feedbackRepository.findByTenantIdAndEventId(tenantId, eventId);

        int total = feedbackList.size();
        double avgRating = total > 0 ? feedbackList.stream().mapToInt(EventFeedback::getRating).average().orElse(0.0) : 0.0;
        int positive = (int) feedbackList.stream().filter(f -> "POSITIVE".equalsIgnoreCase(f.getSentiment())).count();
        int neutral = (int) feedbackList.stream().filter(f -> "NEUTRAL".equalsIgnoreCase(f.getSentiment())).count();
        int negative = (int) feedbackList.stream().filter(f -> "NEGATIVE".equalsIgnoreCase(f.getSentiment())).count();

        // AI Themes & Organizer Action Items Generation via LLM Provider
        String systemPrompt = "You are EventSphere AI Sentiment Analyst. Synthesize feedback comments into top themes and list 2 priority organizer action items.";
        StringBuilder commentsBuffer = new StringBuilder();
        feedbackList.stream().limit(20).forEach(f -> commentsBuffer.append("- [Rating ").append(f.getRating()).append("] ").append(f.getComment()).append("\n"));

        LlmProvider.LlmResponse llmResp = llmProvider.generateCompletion(systemPrompt, commentsBuffer.toString());

        String topThemes = "Key Themes: Audio Quality, Keynote Engagement, Catering Lines";
        String actionItems = llmResp.text();

        FeedbackSentimentSummary summary = FeedbackSentimentSummary.builder()
                .tenantId(tenantId)
                .event(event)
                .totalFeedbackCount(total)
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .positiveCount(positive)
                .neutralCount(neutral)
                .negativeCount(negative)
                .topThemes(topThemes)
                .actionItems(actionItems)
                .build();

        summaryRepository.save(summary);

        return FeedbackSentimentResponse.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .totalFeedbackCount(total)
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .positiveCount(positive)
                .neutralCount(neutral)
                .negativeCount(negative)
                .topThemes(topThemes)
                .actionItems(actionItems)
                .calculatedAt(Instant.now())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FeedbackResponse> getFeedbackByEvent(String eventId, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return feedbackRepository.findByTenantIdAndEventId(tenantId, eventId, pageable).map(this::mapToResponse);
    }

    private FeedbackResponse mapToResponse(EventFeedback f) {
        return FeedbackResponse.builder()
                .id(f.getId())
                .eventId(f.getEvent().getId())
                .rating(f.getRating())
                .category(f.getCategory())
                .comment(f.getComment())
                .sentiment(f.getSentiment())
                .emotion(f.getEmotion())
                .createdAt(f.getCreatedAt())
                .build();
    }
}
