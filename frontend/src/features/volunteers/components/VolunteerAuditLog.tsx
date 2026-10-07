'use client';

import React from 'react';
import { VolunteerAuditActivity } from '../types/volunteer.types';
import { Activity, Clock, ShieldCheck } from 'lucide-react';

interface VolunteerAuditLogProps {
  logs: VolunteerAuditActivity[];
}

export const VolunteerAuditLog: React.FC<VolunteerAuditLogProps> = ({ logs }) => {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-neutral-800">
        <Activity className="w-5 h-5 text-indigo-400" />
        <div>
          <h3 className="text-base font-bold text-white">Staff Gate Operations Audit Feed</h3>
          <p className="text-xs text-neutral-400">Real-time audit log of volunteer turnstile scans and status changes</p>
        </div>
      </div>

      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-xl flex items-center justify-between text-xs"
          >
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">{log.volunteerName}</span>
                <span className="text-neutral-400 block">{log.action} • {log.zone}</span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-neutral-500 shrink-0">{log.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
