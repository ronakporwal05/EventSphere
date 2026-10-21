package com.eventsphere.feedback.service;

import com.eventsphere.feedback.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AiFeedbackService {

    FeedbackResponse submitFeedback(FeedbackSubmitRequest request);

    FeedbackSentimentResponse analyzeEventFeedbackSentiment(String eventId);

    Page<FeedbackResponse> getFeedbackByEvent(String eventId, Pageable pageable);
}
