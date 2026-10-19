'use client';

import React from 'react';
import { NetworkingMatch } from '../types/ai.types';
import { Users, Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

interface AttendeeMatchmakerProps {
  matches: NetworkingMatch[];
}

export const AttendeeMatchmaker: React.FC<AttendeeMatchmakerProps> = ({ matches }) => {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-neutral-800">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <div>
          <h3 className="text-base font-bold text-white">AI Attendee Matchmaker Engine</h3>
          <p className="text-xs text-neutral-400">Smart B2B networking recommendations derived from vector profile embeddings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((match) => (
          <div key={match.id} className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-3 hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">{match.name}</span>
                <span className="text-xs text-neutral-400 block">{match.role} • {match.company}</span>
              </div>
              <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full font-extrabold text-xs">
                {match.matchScore}% Match
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/60">
              💡 {match.reason}
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex flex-wrap gap-1">
                {match.sharedInterests.map((interest) => (
                  <span key={interest} className="px-2 py-0.5 bg-neutral-900 text-neutral-400 text-[10px] rounded border border-neutral-800">
                    {interest}
                  </span>
                ))}
              </div>

              <button
                onClick={() => toast.success(`Connection invite sent to ${match.name}`)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1"
              >
                <span>Connect</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
