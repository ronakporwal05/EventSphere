import { apiClient } from '@/lib/api-client';
import { AiGenerationRequest, RagDocument, NetworkingMatch, CopilotMessage } from '../types/ai.types';

export const aiService = {
  generateContent: async (input: AiGenerationRequest): Promise<{ generatedText: string }> => {
    try {
      const response = await apiClient.post('/ai/generate', input);
      return response.data.data;
    } catch {
      // Mock generated output
      const sampleCopies: Record<string, string> = {
        EVENT_DESCRIPTION:
          "🚀 Join the premier enterprise technology conference of 2026! EventSphere AI Global Keynote brings together industry visionaries, staff engineers, and AI architects to explore multi-tenant microservices, vector database scaling, and real-time operational telemetry. Reserve your pass now to secure exclusive breakout sessions and keynote networking.",
        SOCIAL_POST:
          "Excited to announce #EventSphereAI2026! 🌟 Discover how multi-tenant AI automation is reshaping enterprise event operations. Early bird passes available today! Link in bio. 🚀 #AI #TechConference #NextJS #SpringBoot",
        PROMO_EMAIL:
          "Subject: Exclusive VIP Invitation: EventSphere AI 2026 Keynote\n\nDear Leader,\n\nWe are thrilled to invite you to EventSphere AI Global Keynote 2026. Experience live technical demonstrations on RAG knowledge bases, automated check-in turnstiles, and LLM copilots.\n\nClaim your VIP ticket today.",
        SPEAKER_BIO:
          "Dr. Aris Thorne is a Senior AI Architect specializing in high-throughput vector similarity search, Qdrant embeddings, and multi-tenant cloud orchestration with over 15 years of distributed systems experience.",
      };
      return { generatedText: sampleCopies[input.contentType] || sampleCopies.EVENT_DESCRIPTION };
    }
  },

  getRagDocuments: async (): Promise<RagDocument[]> => {
    try {
      const response = await apiClient.get('/ai/rag/documents');
      return response.data.data;
    } catch {
      return [
        { id: 'rag-1', filename: 'EventSphere_2026_Attendee_Guide.pdf', fileSize: '4.2 MB', chunkCount: 128, uploadedAt: '2026-08-01', status: 'INDEXED' },
        { id: 'rag-2', filename: 'Convention_Center_Floorplan_Map.pdf', fileSize: '1.8 MB', chunkCount: 45, uploadedAt: '2026-08-03', status: 'INDEXED' },
        { id: 'rag-3', filename: 'Speaker_Schedule_Internal_Rules.docx', fileSize: '850 KB', chunkCount: 32, uploadedAt: '2026-08-05', status: 'INDEXED' },
      ];
    }
  },

  uploadRagDocument: async (file: File): Promise<RagDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/ai/rag/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  getAttendeeMatches: async (): Promise<NetworkingMatch[]> => {
    try {
      const response = await apiClient.get('/ai/matchmaker');
      return response.data.data;
    } catch {
      return [
        {
          id: 'm-1',
          name: 'Sophia Martinez',
          company: 'CloudScale Inc',
          role: 'VP Infrastructure',
          matchScore: 98,
          reason: 'Both expressed strong interest in Multi-Tenant Database Partitioning & Vector DBs.',
          sharedInterests: ['Multi-Tenancy', 'Qdrant', 'Spring Boot'],
        },
        {
          id: 'm-2',
          name: 'David Kim',
          company: 'DataFlow Systems',
          role: 'Principal Architect',
          matchScore: 92,
          reason: 'Matching background in Next.js 15 App Router and high-concurrency event telemetry.',
          sharedInterests: ['Next.js 15', 'TanStack Query', 'Tailwind CSS'],
        },
      ];
    }
  },

  sendCopilotPrompt: async (prompt: string): Promise<CopilotMessage> => {
    try {
      const response = await apiClient.post('/ai/copilot', { prompt });
      return response.data.data;
    } catch {
      return {
        id: `msg-${Date.now()}`,
        sender: 'AI',
        text: `EventSphere AI Copilot Response: I analyzed your query regarding "${prompt}". Based on your tenant metrics, gate entry flow is at 42 check-ins/min and capacity is currently at 68%.`,
        timestamp: new Date().toLocaleTimeString(),
      };
    }
  },
};
