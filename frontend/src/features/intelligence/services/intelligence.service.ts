import { apiClient } from '@/lib/api-client';
import {
  ProposalItem,
  EventProgressData,
  DelayPredictionData,
  RegistrationForecastData,
  NoShowPredictionData,
  AnomalyDetectionData,
  SessionCrowdData,
  IntelligenceDashboardData,
} from '../types/intelligence.types';

export const intelligenceService = {
  // 1. Upload & Analyze Proposal via Gemini
  uploadProposal: async (
    eventId: string,
    title: string,
    content: string,
    fileName: string = 'proposal.pdf'
  ): Promise<ProposalItem> => {
    const res = await apiClient.post('/intelligence/proposals', {
      eventId,
      title,
      fileName,
      content,
    });
    return res.data?.data;
  },

  // 2. Fetch Proposals for an event
  getProposals: async (eventId: string): Promise<ProposalItem[]> => {
    const res = await apiClient.get(`/intelligence/events/${eventId}/proposals`);
    return res.data?.data || [];
  },

  // 3. Approve Milestones & Map into Checklist
  approveMilestones: async (
    proposalId: string,
    approvedMilestoneIds: string[],
    proposalStatus: string = 'APPROVED'
  ): Promise<ProposalItem> => {
    const res = await apiClient.post(`/intelligence/proposals/${proposalId}/approve`, {
      approvedMilestoneIds,
      proposalStatus,
    });
    return res.data?.data;
  },

  // 4. Calculate Deterministic Progress
  calculateProgress: async (eventId: string): Promise<EventProgressData> => {
    const res = await apiClient.get(`/intelligence/events/${eventId}/progress`);
    return res.data?.data;
  },

  // 5. Model 1: Event Readiness & Delay Prediction
  predictDelayRisk: async (eventId: string): Promise<DelayPredictionData> => {
    const res = await apiClient.get(`/intelligence/events/${eventId}/delay-prediction`);
    return res.data?.data;
  },

  // 6. Model 2: Registration Forecasting
  forecastRegistrations: async (eventId: string): Promise<RegistrationForecastData> => {
    const res = await apiClient.get(`/intelligence/events/${eventId}/registration-forecast`);
    return res.data?.data;
  },

  // 7. Model 3: Attendee No-Show Prediction
  predictNoShows: async (eventId: string): Promise<NoShowPredictionData> => {
    const res = await apiClient.get(`/intelligence/events/${eventId}/noshow-prediction`);
    return res.data?.data;
  },

  // 8. Model 4: Ticket Fraud & Anomaly Alerts
  detectAnomalies: async (eventId: string): Promise<AnomalyDetectionData> => {
    const res = await apiClient.get(`/intelligence/events/${eventId}/anomalies`);
    return res.data?.data;
  },

  // 9. Model 5: Session Crowd Prediction
  predictSessionCrowds: async (eventId: string): Promise<SessionCrowdData> => {
    const res = await apiClient.get(`/intelligence/events/${eventId}/crowd-prediction`);
    return res.data?.data;
  },

  // 10. Model 6: Algorithmic Dynamic Pricing & Yield Optimization
  getDynamicPricing: async (eventId: string): Promise<any> => {
    const res = await apiClient.get(`/intelligence/events/${eventId}/dynamic-pricing`);
    return res.data?.data;
  },

  applyDynamicPrice: async (eventId: string, newPrice: number): Promise<any> => {
    const res = await apiClient.post(`/intelligence/events/${eventId}/dynamic-pricing/apply?newPrice=${newPrice}`);
    return res.data?.data;
  },

  // 11. Unified Intelligence Dashboard
  getDashboardIntelligence: async (eventId: string): Promise<IntelligenceDashboardData> => {
    const res = await apiClient.get(`/intelligence/events/${eventId}/dashboard`);
    return res.data?.data;
  },
};
