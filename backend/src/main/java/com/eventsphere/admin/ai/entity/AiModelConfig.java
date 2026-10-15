package com.eventsphere.admin.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "ai_model_configs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiModelConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false, unique = true)
    private String tenantId;

    @Column(name = "llm_provider", nullable = false)
    @Builder.Default
    private String llmProvider = "GEMINI_1_5_PRO";

    @Column(name = "embedding_provider", nullable = false)
    @Builder.Default
    private String embeddingProvider = "GEMINI_EMBEDDING_004";

    @Column(nullable = false)
    @Builder.Default
    private double temperature = 0.7;

    @Column(name = "top_p", nullable = false)
    @Builder.Default
    private double topP = 0.9;

    @Column(name = "max_output_tokens", nullable = false)
    @Builder.Default
    private int maxOutputTokens = 2048;

    @Column(name = "daily_token_quota", nullable = false)
    @Builder.Default
    private int dailyTokenQuota = 500000;

    @Column(name = "monthly_token_quota", nullable = false)
    @Builder.Default
    private int monthlyTokenQuota = 15000000;

    @Column(name = "feature_rag_enabled", nullable = false)
    @Builder.Default
    private boolean featureRagEnabled = true;

    @Column(name = "feature_assistant_enabled", nullable = false)
    @Builder.Default
    private boolean featureAssistantEnabled = true;

    @Column(name = "feature_analytics_enabled", nullable = false)
    @Builder.Default
    private boolean featureAnalyticsEnabled = true;

    @Column(name = "feature_content_studio_enabled", nullable = false)
    @Builder.Default
    private boolean featureContentStudioEnabled = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
