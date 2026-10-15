'use client';

import React from 'react';
import { AttendanceConversion } from '../types/analytics.types';
import { Users, UserCheck, Clock, Zap } from 'lucide-react';

interface AttendanceConversionChartProps {
  attendance: AttendanceConversion;
}

export const AttendanceConversionChart: React.FC<AttendanceConversionChartProps> = ({ attendance }) => {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Attendance Conversion Telemetry</h3>
        </div>
        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
          {attendance.conversionRatePercentage}% Check-In Yield
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs font-semibold text-neutral-300 mb-1">
            <span>Checked-In vs Registered</span>
            <span>
              {attendance.totalCheckedIn.toLocaleString()} / {attendance.totalRegistered.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-1000"
              style={{ width: `${attendance.conversionRatePercentage}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-neutral-950/60 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-neutral-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Peak Turnstile Throughput Window:</span>
          </div>
          <span className="font-bold text-white font-mono">{attendance.peakHour}</span>
        </div>
      </div>
    </div>
  );
};
