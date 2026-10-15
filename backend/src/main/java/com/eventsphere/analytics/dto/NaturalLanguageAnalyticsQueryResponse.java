package com.eventsphere.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NaturalLanguageAnalyticsQueryResponse {
    private String query;
    private String aiAnswer;
    private String dataMetricsSummary;
}
