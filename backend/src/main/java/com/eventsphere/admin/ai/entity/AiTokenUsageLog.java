package com.eventsphere.admin.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "ai_token_usage_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiTokenUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "module_name", nullable = false)
    private String moduleName; // DOC_INTEL, RAG, ASSISTANT, ANALYTICS, REPORTS, CONTENT_STUDIO

    @Column(name = "prompt_tokens", nullable = false)
    private int promptTokens;

    @Column(name = "completion_tokens", nullable = false)
    private int completionTokens;

    @Column(name = "total_tokens", nullable = false)
    private int totalTokens;

    @Column(name = "estimated_cost_usd", nullable = false)
    private double estimatedCostUsd;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
