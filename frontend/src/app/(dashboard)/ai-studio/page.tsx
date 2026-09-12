'use client';

import React from 'react';
import { useAiFeatures } from '@/features/ai/hooks/useAiFeatures';
import { AiContentGenerator } from '@/features/ai/components/AiContentGenerator';
import { RagDocumentUploader } from '@/features/ai/components/RagDocumentUploader';
import { AttendeeMatchmaker } from '@/features/ai/components/AttendeeMatchmaker';
import { AiCopilotDrawer } from '@/features/ai/components/AiCopilotDrawer';
import { Sparkles, Cpu } from 'lucide-react';

export default function AiStudioPage() {
  const {
    ragDocs,
    matches,
    generateContent,
    isGenerating,
    copilotHistory,
    sendMessage,
    isCopilotThinking,
  } = useAiFeatures();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Studio & RAG Vector Engine</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Automated marketing copy generation, RAG document indexing, B2B matchmaking, and Copilot</p>
        </div>
        <span className="inline-flex items-center text-xs font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          <Cpu className="w-3.5 h-3.5 mr-1.5" /> Qdrant Vector Engine Active
        </span>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AiContentGenerator onGenerate={generateContent} isGenerating={isGenerating} />
        <AiCopilotDrawer history={copilotHistory} onSendMessage={sendMessage} isThinking={isCopilotThinking} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RagDocumentUploader documents={ragDocs} />
        <AttendeeMatchmaker matches={matches} />
      </div>
    </div>
  );
}
