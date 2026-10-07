'use client';

import React from 'react';
import { AttendanceChartData } from '../types/dashboard.types';
import { Users, TrendingUp } from 'lucide-react';

interface LiveAttendanceChartProps {
  data: AttendanceChartData[];
}

export const LiveAttendanceChart: React.FC<LiveAttendanceChartProps> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.checkedIn), 4000);

  return (
    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Live Attendance Curve</h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">Real-time scanner check-ins throughout today</p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+85.4% Capacity</span>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between h-44 gap-2 px-2">
        {data.map((item, idx) => {
          const heightPct = Math.round((item.checkedIn / maxVal) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative">
              {/* Hover Tooltip */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-neutral-950 text-white text-[10px] py-1 px-2 rounded border border-neutral-700 whitespace-nowrap shadow-xl z-20">
                {item.checkedIn.toLocaleString()} attendees ({item.time})
              </div>

              {/* Bar */}
              <div className="w-full max-w-[28px] bg-neutral-950 rounded-t-lg overflow-hidden border border-neutral-800 flex items-end h-full">
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg group-hover:from-indigo-500 group-hover:to-purple-400 transition-all duration-300"
                  style={{ height: `${heightPct}%` }}
                />
              </div>

              <span className="text-[10px] text-neutral-500 font-medium mt-2 truncate w-full text-center">
                {item.time.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
