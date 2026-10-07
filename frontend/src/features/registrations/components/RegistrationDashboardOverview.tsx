'use client';

import React from 'react';
import { RegistrationMetrics } from '../types/registration.types';
import { Users, Clock, UserX, UserCheck, Download, Sparkles } from 'lucide-react';

interface RegistrationDashboardOverviewProps {
  metrics: RegistrationMetrics;
  onExportCSV: () => void;
}

export const RegistrationDashboardOverview: React.FC<RegistrationDashboardOverviewProps> = ({
  metrics,
  onExportCSV,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Export Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div>
          <h2 className="text-base font-bold text-white">Attendee Registrations & Capacity Hub</h2>
          <p className="text-xs text-neutral-400">Manage attendee approvals, capacity waitlists, and custom checkout forms</p>
        </div>
        <button
          onClick={onExportCSV}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 border border-neutral-700 transition-all"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Export Attendee List (CSV)</span>
        </button>
      </div>

      {/* 4 Core Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Registered</span>
            <h3 className="text-2xl font-bold text-white mt-1">{metrics.totalRegistrations.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Approval Queue</span>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{metrics.pendingApprovals}</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Capacity Waitlist</span>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">{metrics.waitlisted}</h3>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Scanned & Checked-in</span>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{metrics.checkedIn.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
