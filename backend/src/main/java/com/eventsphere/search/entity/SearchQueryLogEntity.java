package com.eventsphere.search.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "search_query_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchQueryLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "query_text", nullable = false)
    private String queryText;

    @Column(name = "entity_filter", nullable = false)
    private String entityFilter;

    @Column(name = "results_found_count", nullable = false)
    private int resultsFoundCount;

    @Column(name = "execution_time_ms", nullable = false)
    private long executionTimeMs;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
