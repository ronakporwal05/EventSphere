'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Building2,
  Cpu,
  Server,
  Users,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  Star,
  Activity,
  ArrowRight,
} from 'lucide-react';

export default function CompanyAdminPage() {
  const sampleAppFeedback = [
    {
      id: 'fb-01',
      user: 'Michael Chen',
      email: 'mchen@techcorp.com',
      rating: 5,
      nps: 9,
      category: 'BOOKING_SPEED',
      comment: '10-minute Redis seat lock is incredible! Zero ticket scalping, checkout took 20 seconds.',
      time: '2 hours ago',
    },
    {
      id: 'fb-02',
      user: 'Sarah Jenkins',
      email: 'sarah.j@enterprise.com',
      rating: 4,
      nps: 8,
      category: 'UI',
      comment: 'Very sleek dark mode interface. Would love Google Pay one-touch integration in next release.',
      time: '4 hours ago',
    },
    {
      id: 'fb-03',
      user: 'Elena Rostova',
      email: 'elena@quantum.io',
      rating: 5,
      nps: 10,
      category: 'FEATURE_REQUEST',
      comment: 'AI Vibe Matcher found me the exact session track I wanted without scrolling through 50 events.',
      time: '1 day ago',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Platform Command Center</h1>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md uppercase">
              👑 Company Admin (Owner)
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">Global multi-tenant governance, Gemini AI token consumption, container telemetry, and app review inbox</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Infrastructure Healthy
          </span>
        </div>
      </div>

      {/* 4 Super Admin Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-2">Global Tenants</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">1</span>
            <span className="text-xs text-purple-400 font-medium">Enterprise Tier</span>
          </div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-2">Gemini 1.5 Tokens</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">142,850</span>
            <span className="text-xs text-emerald-400 font-medium">Flash Model</span>
          </div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-2">App Net Promoter (NPS)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400 font-mono">+74</span>
            <span className="text-xs text-emerald-400 font-medium">World Class</span>
          </div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-2">Container Status</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400 font-mono">5/5</span>
            <span className="text-xs text-neutral-400 font-medium">Docker Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Infrastructure / Right App Feedback Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Platform Controls & Health */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Tenant Services Status</h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">Auto-refresh: 30s</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">PostgreSQL</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-neutral-500 block">Port 5432 • 25 Migrations</span>
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Redis</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-neutral-500 block">Port 6379 • Seat Locks Active</span>
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Qdrant Vector</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-neutral-500 block">Port 6333 • 768-dim</span>
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Spring Boot</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-neutral-500 block">Port 8080 • Java 21</span>
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Next.js Web</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-neutral-500 block">Port 3000 • React 19</span>
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Gemini 1.5</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-neutral-500 block">Google API Connected</span>
              </div>
            </div>
          </div>

          {/* Quick Platform Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/ai-studio"
              className="p-4 bg-neutral-900 border border-neutral-800 hover:border-purple-500/40 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">AI Studio & RAG Index</h4>
                  <p className="text-[11px] text-neutral-400">Inspect vector embeddings & Copilot</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-purple-400 transition-colors" />
            </Link>

            <Link
              href="/analytics"
              className="p-4 bg-neutral-900 border border-neutral-800 hover:border-indigo-500/40 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">Financial BI & Yield</h4>
                  <p className="text-[11px] text-neutral-400">Global billing & ticket revenue</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-indigo-400 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Right 1 Col: App & Platform Feedback Inbox */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">App Review Inbox</h3>
            </div>
            <span className="text-[10px] text-purple-400 font-mono font-bold">Direct to Admin</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {sampleAppFeedback.map((fb) => (
              <div key={fb.id} className="p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{fb.user}</span>
                    <span className="text-[10px] text-neutral-500 block">{fb.email}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-[11px] font-bold font-mono">{fb.rating}/5</span>
                    </div>
                    <span className="text-[9px] text-purple-400 font-mono">NPS {fb.nps}/10</span>
                  </div>
                </div>

                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  "{fb.comment}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-900">
                  <span className="font-mono uppercase">{fb.category}</span>
                  <span>{fb.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
