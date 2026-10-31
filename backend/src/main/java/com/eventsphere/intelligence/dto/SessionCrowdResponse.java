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
public class SessionCrowdResponse {
    private String eventId;
    private int totalSessionsTracked;
    private int overcrowdingAlertsCount;
    private List<Map<String, Object>> sessionForecasts;
    private String modelName;
    private String venueSafetyNote;
}
