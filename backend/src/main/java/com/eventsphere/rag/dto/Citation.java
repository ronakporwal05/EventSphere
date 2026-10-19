package com.eventsphere.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Citation {
    private String documentName;
    private String chunkId;
    private int chunkIndex;
    private double similarityScore;
    private String snippet;
}
