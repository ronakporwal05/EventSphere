package com.eventsphere.feedback.repository;

import com.eventsphere.feedback.entity.FeedbackSentimentSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeedbackSentimentSummaryRepository extends JpaRepository<FeedbackSentimentSummary, String> {
    Optional<FeedbackSentimentSummary> findTopByTenantIdAndEventIdOrderByCreatedAtDesc(String tenantId, String eventId);
}
