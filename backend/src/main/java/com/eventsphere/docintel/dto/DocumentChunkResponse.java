package com.eventsphere.docintel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentChunkResponse {
    private String id;
    private String jobId;
    private int chunkIndex;
    private String content;
    private int charCount;
    private int tokenCount;
    private String embeddingVectorId;
}
