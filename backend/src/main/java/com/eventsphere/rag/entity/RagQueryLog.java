package com.eventsphere.rag.entity;

import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "rag_query_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagQueryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "user_query", nullable = false, columnDefinition = "TEXT")
    private String userQuery;

    @Column(name = "generated_answer", nullable = false, columnDefinition = "TEXT")
    private String generatedAnswer;

    @Column(name = "chunks_retrieved_count", nullable = false)
    private int chunksRetrievedCount;

    @Column(name = "prompt_tokens_used", nullable = false)
    private int promptTokensUsed;

    @Column(name = "completion_tokens_used", nullable = false)
    private int completionTokensUsed;

    @Column(name = "execution_time_ms", nullable = false)
    private long executionTimeMs;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "created_by")
    private String createdBy;
}
