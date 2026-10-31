package com.eventsphere.intelligence.service;

import com.eventsphere.intelligence.dto.*;

import java.util.List;

public interface EventIntelligenceService {

    ProposalResponse uploadAndAnalyzeProposal(ProposalUploadRequest request);

    ProposalResponse getProposal(String proposalId);

    List<ProposalResponse> getProposalsByEvent(String eventId);

    ProposalResponse approveMilestones(String proposalId, MilestoneApprovalRequest request);

    EventProgressResponse calculateProgress(String eventId);

    DelayPredictionResponse predictDelayRisk(String eventId);

    RegistrationForecastResponse forecastRegistrations(String eventId);

    NoShowPredictionResponse predictNoShows(String eventId);

    AnomalyDetectionResponse detectAnomalies(String eventId);

    SessionCrowdResponse predictSessionCrowds(String eventId);

    DynamicPricingResponse calculateDynamicPricing(String eventId);

    DynamicPricingResponse applyOptimalPrice(String eventId, Double newPrice);

    IntelligenceDashboardResponse getDashboardIntelligence(String eventId);
}
