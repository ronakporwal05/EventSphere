package com.eventsphere.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagQueryResponse {
    private String answer;
    private List<Citation> citations;
    private int promptTokens;
    private int completionTokens;
    private long executionTimeMs;
}
