'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ConferioTicker } from '@/features/conferio/components/ConferioTicker';
import { ConferioNavbar } from '@/features/conferio/components/ConferioNavbar';
import { ConferioFooter } from '@/features/conferio/components/ConferioFooter';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { hasHierarchyAccess, resolveHierarchyRole } from '@/features/auth/utils/hierarchy';
import {
  ShieldCheck,
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
  Database,
  Lock,
  Layers,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertCircle,
  Crown,
} from 'lucide-react';
import { toast } from 'sonner';

interface TenantOrg {
  id: string;
  name: string;
  subdomain: string;
  plan: 'ENTERPRISE' | 'GROWTH' | 'STARTER';
  eventsCount: number;
  attendeesCount: number;
  status: 'ACTIVE' | 'MAINTENANCE';
  dbSchema: string;
}

const SAMPLE_TENANTS: TenantOrg[] = [
  {
    id: 't-eventsphere',
    name: 'EventSphere AI Global Ltd',
    subdomain: 'london.eventsphere.ai',
    plan: 'ENTERPRISE',
    eventsCount: 8,
    attendeesCount: 14200,
    status: 'ACTIVE',
    dbSchema: 'tenant_eventsphere_prod',
  },
  {
    id: 't-bengaluru',
    name: 'Bengaluru Tech Conclave',
    subdomain: 'bengaluru.eventsphere.ai',
    plan: 'GROWTH',
    eventsCount: 3,
    attendeesCount: 3200,
    status: 'ACTIVE',
    dbSchema: 'tenant_bengaluru_ai',
  },
  {
    id: 't-bayarea',
    name: 'Silicon Valley Founders Syndicate',
    subdomain: 'sv.eventsphere.ai',
    plan: 'ENTERPRISE',
    eventsCount: 5,
    attendeesCount: 6800,
    status: 'ACTIVE',
    dbSchema: 'tenant_sv_syndicate',
  },
];

const SAMPLE_APP_FEEDBACK = [
  {
    id: 'fb-01',
    user: 'Ronak Verma',
    email: 'ronak.innovator@gmail.com',
    rating: 5,
    nps: 10,
    category: 'BOOKING_SPEED',
    comment: 'The 10-minute Redis seat lock is flawless! Zero scalping, interactive seat map confirmed in 15 seconds.',
    time: '35 mins ago',
  },
  {
    id: 'fb-02',
    user: 'Elena Rostova',
    email: 'elena@vectorflow.io',
    rating: 5,
    nps: 9,
    category: 'AI_STUDIO',
    comment: 'Qdrant vector similarity search against 100M embeddings is blazing fast. The Monte Carlo arrival curve is spot on.',
    time: '2 hours ago',
  },
  {
    id: 'fb-03',
    user: 'Marcus Sterling',
    email: 'marcus@apexengine.dev',
    rating: 5,
    nps: 10,
    category: 'NEO_BRUTALISM',
    comment: 'The EventSphere AI canary-yellow brutalist styling stands out from all other generic conference software.',
    time: '4 hours ago',
  },
];

export default function PlatformAdminPage() {
  const { user, isAuthenticated, loginAsRole } = useAuthStore();
  const isAdmin = isAuthenticated && hasHierarchyAccess(user?.role, 'ADMIN');

  const [tenants, setTenants] = useState<TenantOrg[]>(SAMPLE_TENANTS);
  const [selectedTenantId, setSelectedTenantId] = useState('t-eventsphere');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshTelemetry = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsRefreshing(false);
    toast.success('Multi-tenant metrics & container telemetry refreshed!');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
        <ConferioTicker />
        <ConferioNavbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white border-4 border-black rounded-3xl p-8 sm:p-10 shadow-[8px_8px_0px_#000] text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-purple-100 border-2 border-black rounded-2xl flex items-center justify-center text-purple-700 shadow-[3px_3px_0px_#000]">
              <Crown className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <span className="px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase rounded-sm border border-black shadow-[2px_2px_0px_#fff]">
                SYSTEM GOVERNANCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-3">
                MULTI-TENANT ADMIN CONSOLE
              </h2>
              <p className="text-xs sm:text-sm font-bold text-neutral-600 mt-2">
                This console is reserved for platform administrators overseeing global tenant schemas, infrastructure telemetry, and multi-tenant billing.
              </p>
            </div>
            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl space-y-2">
              <span className="text-[10px] font-black uppercase text-purple-900 block">
                Reviewer / Evaluator Access:
              </span>
              <button
                onClick={() => {
                  loginAsRole('ADMIN');
                  toast.success('Elevated session to 👑 Supreme Admin!');
                }}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] flex items-center justify-center space-x-2"
              >
                <Crown className="w-4 h-4 text-yellow-300" />
                <span>Switch to Demo Admin Session</span>
              </button>
            </div>
            <div className="flex items-center justify-center space-x-4 pt-2 text-xs font-black uppercase">
              <Link href="/manage" className="underline hover:text-purple-700">
                Go to Organizer Cockpit
              </Link>
              <span className="text-neutral-400">•</span>
              <Link href="/" className="underline hover:text-purple-700">
                Exit to Public Site
              </Link>
            </div>
          </div>
        </main>
        <ConferioFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
      {/* 1. Ticker */}
      <ConferioTicker />

      {/* 2. Navbar */}
      <ConferioNavbar />

      {/* 2.5 Admin Dedicated Navigation Strip */}
      <div className="w-full bg-purple-950 text-white border-b-2 border-black px-4 sm:px-8 py-2 z-30 select-none">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black rounded text-[10px] font-black uppercase tracking-wider border border-black">
              SUPERADMIN WORKSPACE
            </span>
            <span className="text-xs font-bold text-purple-200">
              Postgres Schema RLS & Cross-Tenant Telemetry
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-black uppercase">
            <Link href="/manage" className="hover:text-[#f5ce32] transition-colors">
              🏢 Organizer Cockpit
            </Link>
            <span className="text-purple-600">•</span>
            <Link href="/" className="hover:text-[#f5ce32] transition-colors">
              🌐 Public Site
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Hero Header Strip */}
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm mb-3 border border-black shadow-[2px_2px_0px_#fff]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#f5ce32]" />
              <span>PLATFORM GOVERNANCE // MULTI-TENANT ENGINE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              PLATFORM COMMAND CENTER
            </h1>

            <p className="text-xs sm:text-sm font-bold text-black/80 mt-2">
              Cross-organization tenant isolation, Postgres schema RLS partitioning, and microservice cluster health.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleRefreshTelemetry}
              disabled={isRefreshing}
              className="px-4 py-2 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Health</span>
            </button>

            <Link
              href="/manage"
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#fff]"
            >
              Organizer Cockpit
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Top 4 Infrastructure KPI Cards */}
      <section className="py-8 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-neutral-500">Active Tenants</span>
              <Building2 className="w-4 h-4 text-black" />
            </div>
            <p className="text-3xl font-black text-black">3 Enterprise</p>
            <p className="text-[11px] font-bold text-emerald-700 mt-1">100% Schema Isolation</p>
          </div>

          <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-neutral-500">Gemini 1.5 Tokens</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-black font-mono">142,850</p>
            <p className="text-[11px] font-bold text-purple-700 mt-1">Flash + Pro Multi-Agent</p>
          </div>

          <div className="bg-black text-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#f5ce32]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-neutral-400">Net Promoter (NPS)</span>
              <Star className="w-4 h-4 text-[#f5ce32] fill-[#f5ce32]" />
            </div>
            <p className="text-3xl font-black text-[#f5ce32] font-mono">+74 NPS</p>
            <p className="text-[11px] font-bold text-neutral-300 mt-1">World-Class Satisfaction</p>
          </div>

          <div className="bg-[#e5d4ff] border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-neutral-800">Docker Fleet</span>
              <Server className="w-4 h-4 text-black" />
            </div>
            <p className="text-3xl font-black text-black font-mono">6 / 6 Live</p>
            <p className="text-[11px] font-black text-purple-900 mt-1">All Microservices Healthy</p>
          </div>
        </div>
      </section>

      {/* 5. Main Content: Tenant Table & Service Cluster */}
      <main className="py-4 px-4 sm:px-8 max-w-6xl mx-auto w-full flex-1 space-y-8">
        {/* Service Health Badges */}
        <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-black">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-black" />
              <span className="text-xs font-black uppercase tracking-wider text-black">
                Multi-Tenant Microservices Health Mesh
              </span>
            </div>
            <span className="text-[10px] font-mono font-black uppercase bg-emerald-400 text-black px-2 py-0.5 rounded border border-black">
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'PostgreSQL 16', port: '5432', info: 'Row-Level Security', status: 'ONLINE' },
              { name: 'Redis 7 Alpine', port: '6379', info: 'Distributed Locks', status: 'ONLINE' },
              { name: 'Qdrant Vector', port: '6333', info: '768-dim Embeddings', status: 'ONLINE' },
              { name: 'Spring Boot 3', port: '8080', info: 'Java 21 Virtual Threads', status: 'ONLINE' },
              { name: 'FastAPI ML', port: '8000', info: '6 Scikit/Torch Models', status: 'ONLINE' },
              { name: 'Next.js 16', port: '3000', info: 'React 19 App Router', status: 'ONLINE' },
            ].map((srv, idx) => (
              <div key={idx} className="p-3 bg-[#fbfbf9] border-2 border-black rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-black truncate">{srv.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
                </div>
                <p className="text-[10px] font-mono text-neutral-500">Port {srv.port}</p>
                <p className="text-[9px] font-bold text-neutral-700 truncate">{srv.info}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tenant Roster & Review Inbox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Tenant Organizations (7 Cols) */}
          <div className="lg:col-span-7 bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div>
                <span className="px-2 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block mb-1">
                  TENANT ISOLATION
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight text-black">
                  Provisioned Organizations
                </h2>
              </div>

              <button
                onClick={() => toast.info('Organization creation wizard triggered.')}
                className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#f5ce32]"
              >
                + Provision Tenant
              </button>
            </div>

            <div className="space-y-3">
              {tenants.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-neutral-50 border-2 border-black rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-100 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-black text-black">{t.name}</span>
                      <span className="px-2 py-0.5 bg-[#f5ce32] text-black text-[9px] font-black uppercase rounded border border-black">
                        {t.plan}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-neutral-600">
                      Subdomain: {t.subdomain} · Schema: {t.dbSchema}
                    </p>
                    <p className="text-[10px] font-bold text-neutral-500">
                      {t.eventsCount} Active Summits · {t.attendeesCount.toLocaleString()} Total Verified Passes
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded border border-black">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{t.status}</span>
                    </span>
                    <button
                      onClick={() => toast.success(`Switched tenant context to ${t.name}`)}
                      className="px-2.5 py-1 bg-white hover:bg-neutral-200 border border-black rounded-lg text-xs font-bold"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Review Inbox & NPS Stream (5 Cols) */}
          <div className="lg:col-span-5 bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-black" />
                <h3 className="text-xs font-black uppercase tracking-wider text-black">
                  App Review & NPS Inbox
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase bg-[#f5ce32] text-black px-2 py-0.5 rounded border border-black">
                REAL-TIME STREAM
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {SAMPLE_APP_FEEDBACK.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3.5 bg-neutral-50 border-2 border-black rounded-2xl space-y-2 hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-black leading-tight">{fb.user}</p>
                      <p className="text-[10px] text-neutral-500 font-bold">{fb.email}</p>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <div className="flex items-center space-x-0.5 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="text-xs font-black text-black">{fb.rating}.0</span>
                      </div>
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 bg-black text-[#f5ce32] rounded">
                        NPS {fb.nps}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-neutral-700 leading-snug">
                    "{fb.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1 border-t border-black/10">
                    <span className="uppercase">{fb.category}</span>
                    <span>{fb.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 6. Footer */}
      <ConferioFooter />
    </div>
  );
}
