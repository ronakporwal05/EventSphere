'use client';

import React from 'react';
import { Bot, Sparkles, Cpu, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface AiUsageWidgetProps {
  tokensUsed: number;
}

export const AiUsageWidget: React.FC<AiUsageWidgetProps> = ({ tokensUsed }) => {
  const quota = 500000;
  const percentage = Math.min(100, Math.round((tokensUsed / quota) * 100));

  return (
    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">AI Model Quotas</h3>
            <p className="text-sm font-bold text-white">Gemini 1.5 Pro & Embedding-004</p>
          </div>
        </div>
        <Link href="/admin/ai" className="text-xs text-purple-400 hover:text-purple-300 font-semibold">
          Manage Config
        </Link>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">Monthly Token Usage</span>
          <span className="text-white font-mono font-semibold">
            {tokensUsed.toLocaleString()} / {quota.toLocaleString()}
          </span>
        </div>

        <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
          <span>{percentage}% of monthly quota consumed</span>
          <span>Resets in 12 days</span>
        </div>
      </div>
    </div>
  );
};
