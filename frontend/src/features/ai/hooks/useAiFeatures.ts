import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '../services/ai.service';
import { AiGenerationRequest, CopilotMessage } from '../types/ai.types';
import { toast } from 'sonner';

export const useAiFeatures = () => {
  const queryClient = useQueryClient();
  const [copilotHistory, setCopilotHistory] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'AI',
      text: 'Hello! I am your EventSphere AI Copilot. Ask me anything about event logistics, attendee matchmaker profiles, or live telemetry data.',
      timestamp: 'Just now',
    },
  ]);

  const ragDocsQuery = useQuery({
    queryKey: ['ai', 'ragDocs'],
    queryFn: aiService.getRagDocuments,
  });

  const matchesQuery = useQuery({
    queryKey: ['ai', 'matches'],
    queryFn: aiService.getAttendeeMatches,
  });

  const generateMutation = useMutation({
    mutationFn: (input: AiGenerationRequest) => aiService.generateContent(input),
    onSuccess: () => {
      toast.success('AI content generated!');
    },
  });

  const sendCopilotMutation = useMutation({
    mutationFn: (prompt: string) => aiService.sendCopilotPrompt(prompt),
    onSuccess: (resMessage) => {
      setCopilotHistory((prev) => [...prev, resMessage]);
    },
  });

  const handleUserSendMessage = (text: string) => {
    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text,
      timestamp: new Date().toLocaleTimeString(),
    };
    setCopilotHistory((prev) => [...prev, userMsg]);
    sendCopilotMutation.mutate(text);
  };

  return {
    ragDocs: ragDocsQuery.data || [],
    matches: matchesQuery.data || [],
    isLoadingDocs: ragDocsQuery.isLoading,
    generateContent: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    copilotHistory,
    sendMessage: handleUserSendMessage,
    isCopilotThinking: sendCopilotMutation.isPending,
  };
};
