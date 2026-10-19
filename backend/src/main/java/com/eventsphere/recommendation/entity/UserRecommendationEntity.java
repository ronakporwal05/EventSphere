package com.eventsphere.recommendation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "user_recommendations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRecommendationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "recommendation_type", nullable = false)
    private String recommendationType; // EVENT, SESSION, NETWORKING

    @Column(name = "target_id", nullable = false)
    private String targetId;

    @Column(name = "match_score", nullable = false)
    private double matchScore;

    @Column(name = "recommendation_reason", nullable = false)
    private String recommendationReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
