'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Scan,
  Users,
  Ticket,
  TrendingUp,
  Activity,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';

export default function ManagementPortalPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Event Management Studio</h1>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md uppercase">
              Organizer Role
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">Operational cockpit for event creation, turnstile gate check-ins, and attendee sentiment</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/scanner"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <Scan className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch Turnstile Scanner</span>
          </Link>
          <Link
            href="/events"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* 4 Operations Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-2">Active Events</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">3</span>
            <span className="text-xs text-indigo-400 font-medium">1 In-Person, 2 Hybrid</span>
          </div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-2">Live Checked In</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400">3,420</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gate Live
            </span>
          </div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-2">Ticket Gross Volume</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">$184,250</span>
            <span className="text-xs text-emerald-400 font-medium">+18.2% vs target</span>
          </div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-2">Event Sentiment Score</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-purple-400 flex items-center gap-1">
              <Star className="w-5 h-5 fill-purple-400" />
              4.8
            </span>
            <span className="text-xs text-purple-400 font-medium">Gemini Analyzed</span>
          </div>
        </div>
      </div>

      {/* Main Operations Split: Tools & Sentiment Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Organizer Tools */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/events"
              className="p-5 bg-neutral-900 border border-neutral-800 hover:border-indigo-500/40 rounded-2xl flex flex-col justify-between space-y-3 group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Event Management Studio</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Build sessions, tracks, and speakers</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                Manage Events <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/tickets"
              className="p-5 bg-neutral-900 border border-neutral-800 hover:border-purple-500/40 rounded-2xl flex flex-col justify-between space-y-3 group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Tier & AI Pricing Console</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Redis seat hold locks & surge elasticity</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-400 flex items-center gap-1">
                Configure Tiers <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/scanner"
              className="p-5 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 rounded-2xl flex flex-col justify-between space-y-3 group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Turnstile QR Scanner</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">High-speed barcode scanner with sound alerts</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Launch Gate Mode <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/registrations"
              className="p-5 bg-neutral-900 border border-neutral-800 hover:border-indigo-500/40 rounded-2xl flex flex-col justify-between space-y-3 group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Attendee Approvals</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Waitlist management and CSV exports</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                View Roster <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Right 1 Col: AI Synthesized Event Feedback */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Event Sentiment Summary</h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              92% Positive
            </span>
          </div>

          <div className="space-y-3 flex-1 text-xs">
            <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Top Attendee Themes</span>
              <p className="text-neutral-200 leading-relaxed text-[11px]">
                Keynote presentations, rapid turnstile QR check-in, and networking lounge rated exceptionally high.
              </p>
            </div>

            <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-300 block">Gemini Action Item</span>
              <p className="text-purple-200 leading-relaxed text-[11px]">
                Add 2 more coffee baristas during morning keynote rush to reduce queue time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
