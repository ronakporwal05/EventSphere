package com.eventsphere.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnomalyDetectionResponse {
    private String eventId;
    private int totalTransactionsAnalyzed;
    private int flaggedAnomaliesCount;
    private double overallAnomalyRate;
    private List<Map<String, Object>> flaggedEvents;
    private String modelName;
    private String isolationForestBaseline;
    private String securityDisclaimer;
}
