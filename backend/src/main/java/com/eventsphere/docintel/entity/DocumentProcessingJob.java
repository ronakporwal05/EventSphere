package com.eventsphere.docintel.entity;

import com.eventsphere.common.entity.AuditableEntity;
import com.eventsphere.event.entity.Event;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "document_processing_jobs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentProcessingJob extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "document_name", nullable = false)
    private String documentName;

    @Column(name = "file_type", nullable = false)
    private String fileType; // PDF, DOCX, TXT, MD

    @Column(name = "file_size_bytes", nullable = false)
    @Builder.Default
    private long fileSizeBytes = 0;

    @Column(nullable = false)
    @Builder.Default
    private String status = "QUEUED"; // QUEUED, PROCESSING, COMPLETED, FAILED

    @Column(name = "total_chunks", nullable = false)
    @Builder.Default
    private int totalChunks = 0;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "processed_at")
    private Instant processedAt;
}
