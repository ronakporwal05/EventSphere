'use client';

import React from 'react';
import { TelemetryStats } from '../types/scanner.types';
import { Activity, Users, Zap, CheckCircle } from 'lucide-react';

interface LiveAttendanceTelemetryProps {
  stats: TelemetryStats;
}

export const LiveAttendanceTelemetry: React.FC<LiveAttendanceTelemetryProps> = ({ stats }) => {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Turnstile Entry Telemetry</h3>
        </div>
        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" /> LIVE STREAM
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase">Venue Total Checked-In</span>
          <div className="flex items-center space-x-2 mt-1">
            <Users className="w-5 h-5 text-indigo-400" />
            <span className="text-xl font-black text-white">{stats.totalScanned.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase">Entry Flow Rate</span>
          <div className="flex items-center space-x-2 mt-1">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-xl font-black text-white">{stats.entryRatePerMinute} <span className="text-xs text-neutral-400 font-normal">/ min</span></span>
          </div>
        </div>
      </div>

      {/* Recent Scan History Feed */}
      <div className="space-y-2 pt-2 border-t border-neutral-800">
        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">Recent Gate Activity Log</span>
        {stats.recentScans.length === 0 ? (
          <p className="text-xs text-neutral-500 italic py-2">No gate entries scanned in current terminal session.</p>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
            {stats.recentScans.map((scan, idx) => (
              <div key={idx} className="p-2 bg-neutral-950/40 rounded-lg border border-neutral-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white truncate max-w-[140px]">{scan.attendeeName || scan.ticketCode}</span>
                </div>
                <span className="font-mono text-[10px] text-neutral-500">{scan.scannedAt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
