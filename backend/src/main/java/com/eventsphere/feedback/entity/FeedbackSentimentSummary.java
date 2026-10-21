package com.eventsphere.feedback.entity;

import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "feedback_sentiment_summaries")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackSentimentSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "total_feedback_count", nullable = false)
    private int totalFeedbackCount;

    @Column(name = "average_rating", nullable = false)
    private double averageRating;

    @Column(name = "positive_count", nullable = false)
    private int positiveCount;

    @Column(name = "neutral_count", nullable = false)
    private int neutralCount;

    @Column(name = "negative_count", nullable = false)
    private int negativeCount;

    @Column(name = "top_themes", columnDefinition = "TEXT")
    private String topThemes;

    @Column(name = "action_items", nullable = false, columnDefinition = "TEXT")
    private String actionItems;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
