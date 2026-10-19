export interface AiGenerationRequest {
  prompt: string;
  contentType: 'EVENT_DESCRIPTION' | 'SOCIAL_POST' | 'PROMO_EMAIL' | 'SPEAKER_BIO';
  tone: 'PROFESSIONAL' | 'CASUAL' | 'EXCITING' | 'FORMAL';
}

export interface RagDocument {
  id: string;
  filename: string;
  fileSize: string;
  chunkCount: number;
  uploadedAt: string;
  status: 'INDEXED' | 'PROCESSING' | 'FAILED';
}

export interface NetworkingMatch {
  id: string;
  name: string;
  company: string;
  role: string;
  matchScore: number;
  reason: string;
  sharedInterests: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
}
