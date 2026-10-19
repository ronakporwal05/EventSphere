package com.eventsphere.docintel.service;

import com.eventsphere.ai.provider.EmbeddingProvider;
import com.eventsphere.ai.provider.VectorStoreProvider;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.docintel.dto.*;
import com.eventsphere.docintel.entity.DocumentChunk;
import com.eventsphere.docintel.entity.DocumentProcessingJob;
import com.eventsphere.docintel.repository.DocumentChunkRepository;
import com.eventsphere.docintel.repository.DocumentProcessingJobRepository;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentIntelligenceServiceImpl implements DocumentIntelligenceService {

    private final DocumentProcessingJobRepository jobRepository;
    private final DocumentChunkRepository chunkRepository;
    private final EventRepository eventRepository;

    private final EmbeddingProvider embeddingProvider;
    private final VectorStoreProvider vectorStoreProvider;

    @Override
    @Transactional
    public DocumentJobResponse processAndIngestDocument(DocumentIngestRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Starting Document Intelligence Ingestion for '{}' (Type: {})", request.getDocumentName(), request.getFileType());

        Event event = null;
        if (request.getEventId() != null && !request.getEventId().isBlank()) {
            event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId).orElse(null);
        }

        DocumentProcessingJob job = DocumentProcessingJob.builder()
                .tenantId(tenantId)
                .event(event)
                .documentName(request.getDocumentName())
                .fileType(request.getFileType().toUpperCase())
                .fileSizeBytes(request.getRawTextContent().getBytes().length)
                .status("PROCESSING")
                .totalChunks(0)
                .build();

        DocumentProcessingJob savedJob = jobRepository.save(job);

        // Synchronous / Inline Chunks & Embedding Execution
        try {
            List<String> rawChunks = chunkText(request.getRawTextContent(),
                    request.getChunkSize() > 0 ? request.getChunkSize() : 500,
                    request.getChunkOverlap() > 0 ? request.getChunkOverlap() : 50);

            List<DocumentChunk> chunkEntities = new ArrayList<>();
            for (int i = 0; i < rawChunks.size(); i++) {
                String snippet = rawChunks.get(i);
                float[] vector = embeddingProvider.generateEmbedding(snippet);

                String vectorId = "vec-" + UUID.randomUUID().toString();
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("tenant_id", tenantId);
                metadata.put("job_id", savedJob.getId());
                metadata.put("event_id", event != null ? event.getId() : "GLOBAL");
                metadata.put("chunk_index", i);

                vectorStoreProvider.storeVector("eventsphere_knowledge", vectorId, vector, metadata);

                DocumentChunk chunk = DocumentChunk.builder()
                        .tenantId(tenantId)
                        .job(savedJob)
                        .event(event)
                        .chunkIndex(i)
                        .content(snippet)
                        .charCount(snippet.length())
                        .tokenCount(snippet.length() / 4) // Approximate token ratio
                        .embeddingVectorId(vectorId)
                        .metadataJson("{\"vector_db\":\"qdrant\", \"dimension\":768}")
                        .build();

                chunkEntities.add(chunk);
            }

            chunkRepository.saveAll(chunkEntities);

            savedJob.setStatus("COMPLETED");
            savedJob.setTotalChunks(rawChunks.size());
            savedJob.setProcessedAt(Instant.now());
            jobRepository.save(savedJob);

            log.info("Document Intelligence Ingestion completed successfully for job '{}' ({} chunks created)", savedJob.getId(), rawChunks.size());

        } catch (Exception e) {
            log.error("Document Intelligence Pipeline failed for job '{}'", savedJob.getId(), e);
            savedJob.setStatus("FAILED");
            savedJob.setErrorMessage(e.getMessage());
            jobRepository.save(savedJob);
        }

        return mapToJobResponse(savedJob);
    }

    private List<String> chunkText(String text, int windowSize, int overlap) {
        List<String> chunks = new ArrayList<>();
        if (text == null || text.isBlank()) {
            return chunks;
        }

        String normalized = text.replaceAll("\\s+", " ").trim();
        int length = normalized.length();
        int step = windowSize - overlap;

        for (int i = 0; i < length; i += step) {
            int end = Math.min(i + windowSize, length);
            chunks.add(normalized.substring(i, end));
            if (end == length) break;
        }
        return chunks;
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentJobResponse getJobStatus(String jobId) {
        String tenantId = TenantContext.getTenantId();
        DocumentProcessingJob job = jobRepository.findByIdAndTenantIdAndDeletedFalse(jobId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Document processing job not found"));
        return mapToJobResponse(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DocumentJobResponse> getJobs(Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return jobRepository.findByTenantIdAndDeletedFalse(tenantId, pageable).map(this::mapToJobResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentChunkResponse> getJobChunks(String jobId) {
        String tenantId = TenantContext.getTenantId();
        return chunkRepository.findByTenantIdAndJobIdOrderByChunkIndexAsc(tenantId, jobId).stream()
                .map(c -> DocumentChunkResponse.builder()
                        .id(c.getId())
                        .jobId(c.getJob().getId())
                        .chunkIndex(c.getChunkIndex())
                        .content(c.getContent())
                        .charCount(c.getCharCount())
                        .tokenCount(c.getTokenCount())
                        .embeddingVectorId(c.getEmbeddingVectorId())
                        .build())
                .collect(Collectors.toList());
    }

    private DocumentJobResponse mapToJobResponse(DocumentProcessingJob j) {
        return DocumentJobResponse.builder()
                .id(j.getId())
                .eventId(j.getEvent() != null ? j.getEvent().getId() : null)
                .documentName(j.getDocumentName())
                .fileType(j.getFileType())
                .fileSizeBytes(j.getFileSizeBytes())
                .status(j.getStatus())
                .totalChunks(j.getTotalChunks())
                .errorMessage(j.getErrorMessage())
                .processedAt(j.getProcessedAt())
                .createdAt(j.getCreatedAt())
                .build();
    }
}
