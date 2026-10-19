package com.eventsphere.recommendation.service;

import com.eventsphere.recommendation.dto.*;

import java.util.List;

public interface RecommendationService {

    List<EventRecommendation> getRecommendedEvents(String currentUserId);

    List<SessionRecommendation> getRecommendedSessions(String currentUserId, String eventId);

    List<NetworkingRecommendation> getNetworkingRecommendations(String currentUserId, String eventId);
}
