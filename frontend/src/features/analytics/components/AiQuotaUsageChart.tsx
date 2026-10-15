'use client';

import React from 'react';
import { AiUsageMetrics } from '../types/analytics.types';
import { Cpu, Sparkles, Database, Bot } from 'lucide-react';

interface AiQuotaUsageChartProps {
  aiUsage: AiUsageMetrics;
}

export const AiQuotaUsageChart: React.FC<AiQuotaUsageChartProps> = ({ aiUsage }) => {
  const percentage = Math.round((aiUsage.tokensUsedThisMonth / aiUsage.monthlyQuota) * 100);

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">AI Token Quota & LLM Telemetry</h3>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          {percentage}% Monthly Quota Consumed
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-neutral-300">
          <span>Monthly LLM Tokens</span>
          <span>
            {aiUsage.tokensUsedThisMonth.toLocaleString()} / {aiUsage.monthlyQuota.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 flex items-center space-x-3">
          <Database className="w-4 h-4 text-purple-400" />
          <div>
            <span className="text-xs font-bold text-white block">{aiUsage.ragQueriesProcessed.toLocaleString()}</span>
            <span className="text-[10px] text-neutral-400 block">Qdrant RAG Queries</span>
          </div>
        </div>

        <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 flex items-center space-x-3">
          <Bot className="w-4 h-4 text-indigo-400" />
          <div>
            <span className="text-xs font-bold text-white block">{aiUsage.copilotSessions.toLocaleString()}</span>
            <span className="text-[10px] text-neutral-400 block">Copilot Sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
