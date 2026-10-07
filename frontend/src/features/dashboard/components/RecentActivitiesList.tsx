'use client';

import React from 'react';
import { ActivityItem } from '../types/dashboard.types';
import { UserCheck, Bot, UserPlus, FileText, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RecentActivitiesListProps {
  activities: ActivityItem[];
}

export const RecentActivitiesList: React.FC<RecentActivitiesListProps> = ({ activities }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'CHECKIN':
        return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'AI_QUERY':
        return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'REGISTRATION':
        return <UserPlus className="w-4 h-4 text-purple-400" />;
      case 'REPORT_GEN':
        return <FileText className="w-4 h-4 text-amber-400" />;
      default:
        return <Calendar className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-sm font-bold text-white">Live Activity Stream</h3>
          <p className="text-xs text-neutral-400">Real-time tenant telemetry & AI operations</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </div>

      <div className="flex-1 mt-4 space-y-3.5 overflow-y-auto max-h-[320px] custom-scrollbar pr-1">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start space-x-3 p-3 bg-neutral-950/50 border border-neutral-800/80 rounded-xl hover:border-neutral-700 transition-colors"
          >
            <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 mt-0.5">
              {getIcon(act.type)}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-200 truncate">{act.title}</span>
                <span className="text-[10px] text-neutral-500">{act.timestamp}</span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{act.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800 text-center">
        <Link href="/analytics" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center space-x-1 transition-colors">
          <span>View Full Telemetry Logs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
