package com.eventsphere.docintel.service;

import com.eventsphere.docintel.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DocumentIntelligenceService {

    DocumentJobResponse processAndIngestDocument(DocumentIngestRequest request);

    DocumentJobResponse getJobStatus(String jobId);

    Page<DocumentJobResponse> getJobs(Pageable pageable);

    List<DocumentChunkResponse> getJobChunks(String jobId);
}
