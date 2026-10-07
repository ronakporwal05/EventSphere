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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-xs text-neutral-400 mt-1">Live attendee check-ins, event performance, and AI copilot</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/scanner"
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all"
          >
            <Scan className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch Scanner</span>
          </Link>
          <Link
            href="/events"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Primary Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-neutral-900 border border-neutral-800/90 rounded-2xl p-5 hover:border-neutral-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Total Events</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white tabular-nums">{metrics.totalEvents}</span>
            <span className="text-xs text-indigo-400 font-medium">3 active today</span>
          </div>
        </div>

        {/* Total Registrations */}
        <div className="bg-neutral-900 border border-neutral-800/90 rounded-2xl p-5 hover:border-neutral-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Registrations</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white tabular-nums">{metrics.totalRegistrations.toLocaleString()}</span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              +24%
            </span>
          </div>
        </div>

        {/* Live Attendance */}
        <div className="bg-neutral-900 border border-neutral-800/90 rounded-2xl p-5 hover:border-neutral-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Checked In</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white tabular-nums">{metrics.liveAttendance.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live gate
            </span>
          </div>
        </div>

        {/* Gemini AI Usage */}
        <div className="bg-neutral-900 border border-neutral-800/90 rounded-2xl p-5 hover:border-neutral-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">AI Operations</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white tabular-nums">{metrics.aiTokensUsed.toLocaleString()}</span>
            <span className="text-xs text-amber-400/90 font-medium">Tokens synced</span>
          </div>
        </div>
      </div>

      {/* ── Two-Column Layout: AI Superpower Hub + Recent Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Workspace Banner + Quick Access */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Banner Card */}
          <div className="p-5 bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-purple-950/30 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/40 rounded-xl text-indigo-400 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Gemini 1.5 & RAG Vector Engine</h3>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Active</span>
                </div>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Generate instant marketing campaigns, query multi-tenant event documents, and chat with your attendees using live vector search.
                </p>
              </div>
            </div>
            <Link
              href="/ai-studio"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0 inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open AI Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Access Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/registrations"
              className="p-4 bg-neutral-900 border border-neutral-800/90 hover:border-neutral-700 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-indigo-300 transition-colors">Manage Attendees</span>
                  <span className="text-[11px] text-neutral-400 block">Check-ins, waitlists, CSV exports</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/analytics"
              className="p-4 bg-neutral-900 border border-neutral-800/90 hover:border-neutral-700 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors">Analytics & BI</span>
                  <span className="text-[11px] text-neutral-400 block">Revenue, yield curves, check-in rate</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Live Activity Feed */}
        <div className="p-5 bg-neutral-900 border border-neutral-800/90 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800/80">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Activity Stream</span>
            </h3>
            <span className="text-[10px] text-neutral-500 font-mono">Real-time</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {activities.length > 0 ? (
              activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-indigo-400 mt-0.5 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-neutral-200 font-medium truncate">{act.title}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{act.description}</p>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">{act.timestamp}</span>
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
