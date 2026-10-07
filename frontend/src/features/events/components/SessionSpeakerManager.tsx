'use client';

import React from 'react';
import { Session } from '../types/event.types';
import { Clock, User, Mic, Plus } from 'lucide-react';

interface SessionSpeakerManagerProps {
  sessions?: Session[];
}

export const SessionSpeakerManager: React.FC<SessionSpeakerManagerProps> = ({ sessions = [] }) => {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white">Event Sessions & Keynote Speakers</h3>
          <p className="text-xs text-neutral-400">Track breakout tracks, stage schedules, and speaker bios</p>
        </div>
        <button className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Session</span>
        </button>
      </div>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-xs text-neutral-500 italic py-4 text-center">No sessions configured for this event schedule yet.</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-white">{session.title}</span>
                <div className="flex items-center space-x-3 text-xs text-neutral-400">
                  <span className="inline-flex items-center text-indigo-400">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {session.startTime} - {session.endTime}
                  </span>
                  {session.room && <span className="text-neutral-500">Stage: {session.room}</span>}
                </div>
              </div>

              {session.speakerName && (
                <div className="flex items-center space-x-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                  <div className="p-1 bg-purple-500/10 text-purple-400 rounded-md">
                    <Mic className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">{session.speakerName}</span>
                    <span className="text-[10px] text-neutral-400 block">{session.speakerRole}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
