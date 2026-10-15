package com.eventsphere.analytics.service;

import com.eventsphere.analytics.dto.*;

public interface AiAnalyticsService {

    AiAnalyticsInsights generateEventPredictiveAnalytics(String eventId);

    NaturalLanguageAnalyticsQueryResponse queryAnalytics(NaturalLanguageAnalyticsQueryRequest request);
}
