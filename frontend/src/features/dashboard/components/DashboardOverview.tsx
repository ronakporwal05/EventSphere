'use client';

import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import Link from 'next/link';
import {
  CalendarDays,
  Users,
  UserCheck,
  Bot,
  Sparkles,
  Loader2,
  ArrowRight,
  Plus,
  Scan,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { metrics, activities, isLoading } = useDashboardData();

  if (isLoading || !metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-medium">Loading workspace metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ── Header with Primary Action ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#f5ce32] text-black rounded text-[10px] font-black uppercase mb-1.5 border border-black shadow-[1px_1px_0px_#000]">
            <Sparkles className="w-3 h-3" />
            <span>Multi-Tenant Mission Control</span>
          </div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">Executive Cockpit</h1>
          <p className="text-xs text-neutral-400 mt-1">Live attendee turnstiles, Gemini 1.5 token load, and multi-tenant telemetry</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/scanner"
            className="px-4 py-2.5 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-[3px_3px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            <Scan className="w-4 h-4 stroke-[2.5]" />
            <span>Launch Scanner</span>
          </Link>
          <Link
            href="/events/create"
            className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-[3px_3px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Primary Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-neutral-900 border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] hover:border-[#f5ce32] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">Total Events</span>
            <div className="p-2 rounded-xl bg-[#f5ce32]/10 border border-[#f5ce32]/30 text-[#f5ce32]">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white tabular-nums">{metrics.totalEvents}</span>
            <span className="text-xs text-[#f5ce32] font-black uppercase">Active Summit</span>
          </div>
        </div>

        {/* Total Registrations */}
        <div className="bg-neutral-900 border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] hover:border-[#f5ce32] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">Registrations</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white tabular-nums">{metrics.totalRegistrations.toLocaleString()}</span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-black">
              <TrendingUp className="w-3.5 h-3.5" />
              +24%
            </span>
          </div>
        </div>

        {/* Live Attendance */}
        <div className="bg-neutral-900 border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] hover:border-[#f5ce32] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">Checked In</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white tabular-nums">{metrics.liveAttendance.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-black uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live gate
            </span>
          </div>
        </div>

        {/* Gemini AI Usage */}
        <div className="bg-neutral-900 border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] hover:border-[#f5ce32] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">AI Operations</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white tabular-nums">{metrics.aiTokensUsed.toLocaleString()}</span>
            <span className="text-xs text-amber-400 font-black uppercase">Tokens Synced</span>
          </div>
        </div>
      </div>

      {/* ── Two-Column Layout: AI Superpower Hub + Recent Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Workspace Banner + Quick Access */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Banner Card */}
          <div className="p-6 bg-neutral-900 border-2 border-[#f5ce32] rounded-2xl shadow-[4px_4px_0px_#f5ce32] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#f5ce32] border-2 border-black rounded-xl text-black shrink-0 mt-0.5 shadow-[2px_2px_0px_#000]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black uppercase text-white tracking-tight">Gemini 1.5 & RAG Intelligence</h3>
                  <span className="px-2 py-0.5 text-[9px] font-black bg-[#f5ce32] text-black border border-black rounded uppercase">Active</span>
                </div>
                <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed font-medium">
                  Generate instant marketing campaigns, query multi-tenant event documents, and forecast turnstile surges using live vector search.
                </p>
              </div>
            </div>
            <Link
              href="/ai-studio"
              className="px-4 py-2.5 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shrink-0 inline-flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              <span>Open AI Studio</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>

          {/* Quick Access Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/manage"
              className="p-5 bg-neutral-900 border-2 border-black hover:border-[#f5ce32] rounded-2xl flex items-center justify-between group shadow-[3px_3px_0px_#000] transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-white block group-hover:text-[#f5ce32] transition-colors">Organizer Cockpit</span>
                  <span className="text-[11px] text-neutral-400 block font-medium">Check-ins, waitlists, CSV exports</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-[#f5ce32] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/analytics"
              className="p-5 bg-neutral-900 border-2 border-black hover:border-[#f5ce32] rounded-2xl flex items-center justify-between group shadow-[3px_3px_0px_#000] transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-white block group-hover:text-emerald-300 transition-colors">Analytics & BI</span>
                  <span className="text-[11px] text-neutral-400 block font-medium">Revenue, yield curves, check-in rate</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Live Activity Feed */}
        <div className="p-5 bg-neutral-900 border-2 border-black rounded-2xl flex flex-col shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black">
            <h3 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#f5ce32]" />
              <span>Live Activity Stream</span>
            </h3>
            <span className="text-[10px] text-[#f5ce32] font-black uppercase bg-black px-2 py-0.5 rounded border border-[#f5ce32]/40">Real-time</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {activities.length > 0 ? (
              activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800">
                  <div className="p-1.5 rounded-lg bg-[#f5ce32] text-black border border-black mt-0.5 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-neutral-200 font-bold truncate">{act.title}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{act.description}</p>
                    <span className="text-[10px] text-neutral-500 block mt-0.5 font-mono">{act.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500 py-6 text-center">No recent activity detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
