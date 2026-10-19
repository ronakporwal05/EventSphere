package com.eventsphere.docintel.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.docintel.dto.*;
import com.eventsphere.docintel.service.DocumentIntelligenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doc-intel")
@RequiredArgsConstructor
public class DocumentIntelligenceController {

    private final DocumentIntelligenceService docIntelService;

    @PostMapping("/ingest")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "INGEST_DOCUMENT", entityType = "DOCUMENT_JOB")
    public ResponseEntity<ApiResponse<DocumentJobResponse>> ingestDocument(@Valid @RequestBody DocumentIngestRequest request) {
        DocumentJobResponse response = docIntelService.processAndIngestDocument(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Document ingested and vector embeddings generated successfully", response));
    }

    @GetMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<ApiResponse<DocumentJobResponse>> getJobStatus(@PathVariable("jobId") String jobId) {
        DocumentJobResponse response = docIntelService.getJobStatus(jobId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/jobs")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<PagedResponse<DocumentJobResponse>> getJobs(Pageable pageable) {
        Page<DocumentJobResponse> page = docIntelService.getJobs(pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Document processing jobs retrieved successfully"));
    }

    @GetMapping("/jobs/{jobId}/chunks")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<ApiResponse<List<DocumentChunkResponse>>> getJobChunks(@PathVariable("jobId") String jobId) {
        List<DocumentChunkResponse> chunks = docIntelService.getJobChunks(jobId);
        return ResponseEntity.ok(ApiResponse.success(chunks));
    }
}
