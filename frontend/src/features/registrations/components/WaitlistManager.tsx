'use client';

import React from 'react';
import { AttendeeRegistration } from '../types/registration.types';
import { Sparkles, ArrowUpRight, Shield } from 'lucide-react';

interface WaitlistManagerProps {
  waitlistedList: AttendeeRegistration[];
  onPromote: (id: string) => void;
}

export const WaitlistManager: React.FC<WaitlistManagerProps> = ({ waitlistedList, onPromote }) => {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center space-x-3 pb-3 border-b border-neutral-800">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <div>
          <h3 className="text-base font-bold text-white">Capacity Waitlist Manager ({waitlistedList.length})</h3>
          <p className="text-xs text-neutral-400">Automated queue elevation when event capacity opens up</p>
        </div>
      </div>

      {waitlistedList.length === 0 ? (
        <div className="p-8 text-center bg-neutral-950/40 rounded-xl border border-neutral-800 text-xs text-neutral-500">
          Capacity is healthy. No waitlisted attendees queued.
        </div>
      ) : (
        <div className="space-y-3">
          {waitlistedList.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div>
                  <span className="text-sm font-bold text-white block">{item.attendeeName}</span>
                  <span className="text-xs text-neutral-400 block">{item.attendeeEmail}</span>
                </div>
              </div>

              <button
                onClick={() => onPromote(item.id)}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1 shadow-lg shadow-purple-600/20"
              >
                <span>Promote to Ticket</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
