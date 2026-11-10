'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ConferioTicker } from '@/features/conferio/components/ConferioTicker';
import { ConferioNavbar } from '@/features/conferio/components/ConferioNavbar';
import { ConferioFooter } from '@/features/conferio/components/ConferioFooter';
import { ClerkAuthModal, AuthModalMode } from '@/features/auth/components/ClerkAuthModal';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { hasHierarchyAccess, resolveHierarchyRole } from '@/features/auth/utils/hierarchy';
import { OrganizerWorkspaceBar } from '@/features/organizer/components/OrganizerWorkspaceBar';
import { OrganizerAccessGate } from '@/features/organizer/components/OrganizerAccessGate';
import {
  Sparkles,
  Bot,
  Wand2,
  FileText,
  Users,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Send,
  Upload,
  Search,
  RefreshCw,
  Sliders,
  DollarSign,
  CloudRain,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  MessageSquare,
  HelpCircle,
  BarChart3,
  Loader2,
  Lock,
  Crown,
  Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';

type AiTab = 'predictive' | 'copywriter' | 'copilot' | 'rag' | 'matchmaker';

interface MatchmakerProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  matchScore: number;
  sharedInterests: string[];
  whyMatch: string;
}

const SAMPLE_MATCHES: MatchmakerProfile[] = [
  {
    id: 'm1',
    name: 'Ronak Verma',
    title: 'Lead Architect',
    company: 'Innovate AI',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    matchScore: 98,
    sharedInterests: ['Multi-Tenant Systems', 'Vector DBs', 'Autonomous Agents'],
    whyMatch: 'Both building high-throughput distributed pipelines and evaluating Qdrant indexing.',
  },
  {
    id: 'm2',
    name: 'Elena Rostova',
    title: 'VP of Engineering',
    company: 'VectorFlow',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    matchScore: 94,
    sharedInterests: ['RAG Benchmarking', 'Kafka Streaming', 'FastAPI'],
    whyMatch: 'Speaking on Day 2 in Stage 2. High mutual interest in sub-10ms similarity search.',
  },
  {
    id: 'm3',
    name: 'Marcus Sterling',
    title: 'Founder & CEO',
    company: 'Apex Engine',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    matchScore: 89,
    sharedInterests: ['Generative UI', 'Edge Computing', 'Microeconomics'],
    whyMatch: 'Angel investor looking to meet seed-stage multi-agent developer tooling founders.',
  },
];

export default function AiStudioPage() {
  const { user, isAuthenticated, loginAsRole } = useAuthStore();
  const canAccess = isAuthenticated && hasHierarchyAccess(user?.role, 'EVENT_MANAGER');

  const [activeTab, setActiveTab] = useState<AiTab>('predictive');

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('SIGN_IN');

  // Copywriter State
  const [copyType, setCopyType] = useState<'linkedin' | 'twitter' | 'email' | 'pitch'>('linkedin');
  const [copyTopic, setCopyTopic] = useState('EventSphere AI 2026 Summit Keynote on Autonomous AI Swarms');
  const [generatedCopy, setGeneratedCopy] = useState(
    `🚀 Announcing the 2026 Keynote at EventSphere AI Summit, London!\n\nJoin 12,000+ architects, engineers, and founders at ExCeL London Arena as we unravel the future of autonomous multi-agent systems and zero-latency vector pipelines.\n\nKey highlights:\n• 48 World-class technical keynotes\n• Live production code & architecture reviews\n• VIP rooftop founder networking soiree\n\n🎟️ Limited passes remaining: secure your seat today at eventsphere.ai/pricing\n\n#AI #Engineering #EventSphereAI #MultiTenant`
  );
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  // Copilot Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your EventSphere Predictive Copilot. I can forecast attendance spikes, analyze turnstile throughput, draft promotional schedules, or benchmark ticket velocity. How can I assist your operations today?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatThinking, setIsChatThinking] = useState(false);

  // RAG State
  const [ragQuery, setRagQuery] = useState('');
  const [ragResult, setRagResult] = useState<string | null>(null);
  const [isSearchingRag, setIsSearchingRag] = useState(false);
  const [indexedDocs, setIndexedDocs] = useState([
    { name: 'eventsphere_2026_summit_master_brief.pdf', vectors: '1,420 vectors', size: '2.4 MB', date: 'Jan 15, 2026' },
    { name: 'speaker_technical_guidelines_v3.pdf', vectors: '840 vectors', size: '1.1 MB', date: 'Jan 18, 2026' },
    { name: 'excel_london_arena_safety_floorplan.pdf', vectors: '2,150 vectors', size: '4.8 MB', date: 'Jan 20, 2026' },
  ]);

  // Handle Copywriter Generation
  const handleGenerateCopy = async () => {
    setIsGeneratingCopy(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsGeneratingCopy(false);

    if (copyType === 'twitter') {
      setGeneratedCopy(
        `1/6 We spent 6 months profiling 100M embedding vectors in production for @EventSphereAI 2026.\n\nHere are the 4 counter-intuitive scalability lessons we learned (and why standard RAG breaks down at 10M QPS) 🧵👇\n\n2/6 Lesson 1: Quantization is not free lunch...\n3/6 Lesson 2: Dedicated hardware enclaves save 40% memory...\n4/6 Catch the live breakdown with @ElenaRostova on Jan 23.\n\nGet passes: eventsphere.ai/pricing`
      );
    } else if (copyType === 'email') {
      setGeneratedCopy(
        `Subject: VIP Invitation: Private Speaker Office Hours & Early Badge Access\n\nHi {{FirstName}},\n\nAs an early ticket holder for Innovators Connect Live 2026, you've been granted priority access to schedule 1-on-1 Office Hours with our keynote speakers before general booking opens.\n\nYour pass tier: {{TicketTier}}\nAssigned Turnstile: Gate 1 (West Hall)\n\nClick below to reserve your 20-minute mentor slot: \nhttps://eventsphere.ai/schedule\n\nBest,\nThe EventSphere Steering Committee`
      );
    } else {
      setGeneratedCopy(
        `🔥 The official countdown has begun: 140 days until EventSphere AI 2026 kicks off in London!\n\nWhether you're scaling distributed databases or training multi-agent systems, this is where the industry's senior engineering leaders assemble.\n\nExplore the full 3-day schedule: eventsphere.ai/schedule\n\n#EventSphereAI #SoftwareArchitecture #ArtificialIntelligence`
      );
    }
    toast.success('Generated high-converting marketing copy with AI Copilot!');
  };

  // Handle Copilot Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isChatThinking) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsChatThinking(true);

    await new Promise((r) => setTimeout(r, 800));

    let reply = `Based on current Qdrant embeddings and Monte Carlo turnstile projections, arrival velocity is anticipated to peak between 08:45 AM and 09:15 AM on Day 1. I recommend opening Gate 2 (VIP Skyway) 15 minutes early to keep gate dwell time under 6 seconds per attendee.`;

    if (userText.toLowerCase().includes('price') || userText.toLowerCase().includes('revenue')) {
      reply = `Dynamic Pricing Analysis: VIP All-Access passes are currently pacing at 88% capacity. Our ML elasticity model predicts demand will tolerate an increase to $179 without dampening velocity, projecting an additional +$18,400 in incremental gate revenue.`;
    } else if (userText.toLowerCase().includes('speaker') || userText.toLowerCase().includes('agenda')) {
      reply = `Speaker Tracking: All 48 keynote presenters have confirmed slide decks. Track 2 (AI Infrastructure) has the highest bookmarks (2,180 attendees), so Hall A has been allocated as the primary auditorium with 2,500 seats.`;
    }

    setChatMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    setIsChatThinking(false);
  };

  // Handle RAG Semantic Search
  const handleSearchRag = async () => {
    if (!ragQuery.trim()) return;
    setIsSearchingRag(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSearchingRag(false);
    setRagResult(
      `Retrieved 3 matching chunks from "eventsphere_2026_summit_master_brief.pdf" (Similarity: 0.941):\n\n"Section 4.2 — Attendee Check-in Protocol: Turnstiles operate on high-speed optical barcode decoding. Gates 1 and 2 service West Hall entrance with Elizabeth Line direct connection. VIP ticket holders receive dedicated fast-track lane with zero wait times."`
    );
    toast.success('Retrieved semantic context from Qdrant Vector Base!');
  };

  if (!canAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
        <ConferioTicker />
        <ConferioNavbar
          onOpenAuth={(mode) => {
            setAuthModalMode(mode);
            setIsAuthModalOpen(true);
          }}
        />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <OrganizerAccessGate
            featureName="Predictive AI Studio"
            onOpenAuth={(mode) => {
              setAuthModalMode(mode);
              setIsAuthModalOpen(true);
            }}
          />
        </main>
        <ConferioFooter />
        <ClerkAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
      {/* 1. Marquee Ticker */}
      <ConferioTicker />

      {/* 2. Sticky Navbar */}
      <ConferioNavbar
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
      />

      {/* 2.5 Organizer Dedicated Workspace Bar */}
      <OrganizerWorkspaceBar activeTab="ai-studio" />

      {/* 3. Hero Header Section */}
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm mb-3 border border-black shadow-[2px_2px_0px_#fff]">
              <Sparkles className="w-3.5 h-3.5 text-[#f5ce32]" />
              <span>PREDICTIVE INTELLIGENCE & COPILOT SUITE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-none">
              AI STUDIO & INTELLIGENCE LAB
            </h1>

            <p className="text-xs sm:text-base font-bold text-black/80 mt-2 max-w-xl">
              Monte Carlo arrival forecasting, automated marketing copywriters, RAG vector documentation search, and serendipity matchmaking.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-white border-3 border-black rounded-3xl p-5 shadow-[5px_5px_0px_#000] shrink-0 text-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
              Active ML Engine
            </p>
            <p className="text-2xl font-black text-black">Qdrant + Gemini 1.5</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-400 text-black text-[9px] font-black uppercase rounded border border-black">
              Sub-12ms Latency
            </span>
          </div>
        </div>
      </section>

      {/* 4. Neo-Brutalist Navigation Tabs Bar */}
      <section className="bg-white border-b-4 border-black py-4 px-4 sm:px-8 sticky top-16 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2.5">
          {[
            { id: 'predictive', label: '1. Predictive Engine', icon: Activity },
            { id: 'copywriter', label: '2. Marketing Copywriter', icon: Wand2 },
            { id: 'copilot', label: '3. Operations Copilot', icon: Bot },
            { id: 'rag', label: '4. RAG Knowledge Base', icon: FileText },
            { id: 'matchmaker', label: '5. Founder Matchmaker', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AiTab)}
                className={`px-4 py-2.5 border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 ${
                  isActive
                    ? 'bg-black text-[#f5ce32] shadow-[3px_3px_0px_#f5ce32] -translate-y-[1px]'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-black shadow-[2px_2px_0px_#000]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#f5ce32]' : 'text-black'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Main Tab Content Container */}
      <main className="py-10 px-4 sm:px-8 max-w-6xl mx-auto w-full flex-1">
        {/* ========================================================================= */}
        {/* TAB 1: PREDICTIVE INTELLIGENCE & DELAY RISK ENGINE */}
        {/* ========================================================================= */}
        {activeTab === 'predictive' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-neutral-500">Predicted Turnout</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-3xl font-black text-black">96.4%</p>
                <p className="text-[11px] font-bold text-emerald-700 mt-1">±1.2% Monte Carlo Confidence</p>
              </div>

              <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-neutral-500">Peak Turnstile Arrival</span>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl font-black text-black">08:52 AM</p>
                <p className="text-[11px] font-bold text-neutral-600 mt-1">Estimated 48 arrivals / min</p>
              </div>

              <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-neutral-500">Dynamic Pricing Lift</span>
                  <DollarSign className="w-4 h-4 text-[#f5ce32]" />
                </div>
                <p className="text-3xl font-black text-black">+$18,400</p>
                <p className="text-[11px] font-bold text-purple-700 mt-1">VIP Tier Elasticity: High</p>
              </div>

              <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-neutral-500">Transit & Weather Risk</span>
                  <CloudRain className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-3xl font-black text-emerald-600">LOW (12%)</p>
                <p className="text-[11px] font-bold text-neutral-600 mt-1">Elizabeth Line Normal Service</p>
              </div>
            </div>

            {/* Inflow Timeline & Simulation Chart */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
                <div>
                  <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block mb-1">
                    TIME-SERIES SIMULATION
                  </span>
                  <h2 className="text-2xl font-black uppercase text-black tracking-tight">
                    Turnstile Gate Surge & Queue Predictor
                  </h2>
                </div>
                <button
                  onClick={() => toast.success('Recalculated Monte Carlo simulation with 10,000 iterations.')}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-[2px_2px_0px_#000]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Run 10K Simulation</span>
                </button>
              </div>

              {/* Graphical Bar Histogram */}
              <div className="space-y-3">
                {[
                  { time: '08:00 AM - 08:30 AM', expected: 180, percentage: 22, level: 'Low' },
                  { time: '08:30 AM - 09:00 AM', expected: 540, percentage: 68, level: 'Moderate' },
                  { time: '09:00 AM - 09:30 AM', expected: 780, percentage: 98, level: 'Peak Surge' },
                  { time: '09:30 AM - 10:00 AM', expected: 410, percentage: 51, level: 'Moderate' },
                  { time: '10:00 AM - 10:30 AM', expected: 140, percentage: 17, level: 'Low' },
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-black">
                      <span className="font-mono">{row.time}</span>
                      <span className="font-black">
                        {row.expected} attendees ({row.level})
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 h-5 rounded-lg overflow-hidden border-2 border-black relative">
                      <div
                        className={`h-full transition-all duration-700 ${
                          row.level === 'Peak Surge' ? 'bg-[#f5ce32]' : 'bg-black'
                        }`}
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Actionable AI Recommendations */}
              <div className="p-4 bg-amber-50 border-2 border-black rounded-2xl flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs font-bold text-amber-950">
                  <p className="font-black uppercase tracking-wide">
                    Recommendation for 09:00 AM Surge Window:
                  </p>
                  <p className="mt-0.5">
                    Activate Turnstile Gates 3 and 4 with express pre-printed wristbands. This will keep maximum wait time below 90 seconds per attendee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AI COPYWRITER & MARKETING GENERATOR */}
        {/* ========================================================================= */}
        {activeTab === 'copywriter' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
            {/* Left Form: 5 Cols */}
            <div className="lg:col-span-5 bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="pb-3 border-b-2 border-black">
                <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block mb-1">
                  CONTENT STUDIO
                </span>
                <h2 className="text-xl font-black uppercase text-black tracking-tight">
                  Marketing Copy Generator
                </h2>
              </div>

              {/* Format Switcher */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                  Content Channel
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'linkedin', label: 'LinkedIn Post' },
                    { id: 'twitter', label: 'Twitter Thread' },
                    { id: 'email', label: 'VIP Email Blast' },
                    { id: 'pitch', label: 'Sponsor Outreach' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCopyType(c.id as any)}
                      className={`p-2.5 rounded-xl border-2 border-black text-xs font-black uppercase transition-all ${
                        copyType === c.id
                          ? 'bg-black text-[#f5ce32] shadow-[2px_2px_0px_#f5ce32]'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-black'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic / Prompt */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Key Talking Points / Theme
                </label>
                <textarea
                  rows={4}
                  value={copyTopic}
                  onChange={(e) => setCopyTopic(e.target.value)}
                  placeholder="e.g. Announce 48 speakers, VIP pass availability, live code reviews..."
                  className="w-full p-3.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <button
                type="button"
                disabled={isGeneratingCopy}
                onClick={handleGenerateCopy}
                className="w-full py-3.5 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-2"
              >
                {isGeneratingCopy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Drafting High-Impact Copy...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-black" />
                    <span>Generate Copy with Gemini</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Output: 7 Cols */}
            <div className="lg:col-span-7 bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    Live Generated Output
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCopy);
                      toast.success('Copied text to clipboard!');
                    }}
                    className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 border-2 border-black rounded-lg text-xs font-black uppercase flex items-center space-x-1.5 shadow-[1px_1px_0px_#000]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </button>
                </div>

                <div className="p-4 bg-neutral-50 border-2 border-black rounded-2xl font-mono text-xs text-black leading-relaxed whitespace-pre-wrap min-h-[260px]">
                  {generatedCopy}
                </div>
              </div>

              <div className="p-3 bg-[#e5d4ff] border-2 border-black rounded-xl flex items-center justify-between text-xs font-bold text-black">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-800" />
                  <span>Optimized for Engagement & Conversion</span>
                </span>
                <span className="font-mono text-[11px]">Length: {generatedCopy.length} chars</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AI OPERATIONS COPILOT CHAT */}
        {/* ========================================================================= */}
        {activeTab === 'copilot' && (
          <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
              <div>
                <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block mb-1">
                  CONVERSATIONAL AGENT
                </span>
                <h2 className="text-2xl font-black uppercase text-black tracking-tight">
                  Operations Copilot & Data Assistant
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-black" />
                <span className="text-xs font-black uppercase text-neutral-600">Gemini 1.5 Pro Connected</span>
              </div>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-black uppercase text-neutral-500 py-1">Quick Prompts:</span>
              {[
                'Predict peak arrival hour on Day 1',
                'Should we raise VIP pass price to $179?',
                'Which stage has the highest attendee interest?',
                'Draft a broadcast notification for weather delays',
              ].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInputMessage(p);
                  }}
                  className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 border border-black rounded-lg text-xs font-bold text-black transition-colors"
                >
                  "{p}"
                </button>
              ))}
            </div>

            {/* Chat Messages Feed */}
            <div className="p-4 bg-neutral-50 border-2 border-black rounded-2xl min-h-[320px] max-h-[460px] overflow-y-auto space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-black text-[#f5ce32] border border-black flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-xl p-3.5 rounded-2xl border-2 border-black text-xs font-bold leading-relaxed shadow-[3px_3px_0px_#000] ${
                      msg.role === 'user'
                        ? 'bg-[#f5ce32] text-black rounded-tr-none'
                        : 'bg-white text-black rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isChatThinking && (
                <div className="flex items-center space-x-2 text-xs font-black text-neutral-500 p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Analyzing event database & telemetry...</span>
                </div>
              )}
            </div>

            {/* Chat Input Field */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask your event copilot anything..."
                className="flex-1 px-4 py-3 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isChatThinking}
                className="px-6 py-3 bg-black hover:bg-neutral-800 disabled:opacity-50 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#f5ce32] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center space-x-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RAG KNOWLEDGE BASE & DOCUMENT INDEXER */}
        {/* ========================================================================= */}
        {activeTab === 'rag' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Search Box */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="pb-3 border-b-2 border-black">
                <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block mb-1">
                  VECTOR RETRIEVAL (QDRANT)
                </span>
                <h2 className="text-2xl font-black uppercase text-black tracking-tight">
                  Semantic Knowledge Base Search
                </h2>
                <p className="text-xs font-bold text-neutral-600 mt-0.5">
                  Query floor plans, speaker rider guidelines, safety regulations, and sponsorship specs.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    placeholder="e.g. What are the turnstile check-in rules for Elizabeth Line arrivals?"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSearchRag}
                  disabled={isSearchingRag}
                  className="px-6 py-3 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#f5ce32] transition-all flex items-center space-x-1.5"
                >
                  {isSearchingRag ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Vector Search</span>
                  )}
                </button>
              </div>

              {ragResult && (
                <div className="p-4 bg-emerald-50 border-2 border-black rounded-2xl animate-in fade-in">
                  <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider block mb-1">
                    Semantic Match Retrieved:
                  </span>
                  <p className="font-mono text-xs text-black leading-relaxed whitespace-pre-wrap">
                    {ragResult}
                  </p>
                </div>
              )}
            </div>

            {/* Indexed Document Library */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  Indexed Document Collections ({indexedDocs.length} Active Files)
                </span>
                <button
                  onClick={() => toast.info('Document ingestion pipeline ready. Select PDF to index vectors.')}
                  className="px-3.5 py-1.5 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black uppercase flex items-center space-x-1.5 shadow-[2px_2px_0px_#000]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>+ Index New PDF</span>
                </button>
              </div>

              <div className="space-y-3">
                {indexedDocs.map((doc, i) => (
                  <div
                    key={i}
                    className="p-4 bg-neutral-50 border-2 border-black rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-black text-[#f5ce32] border border-black flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-black">{doc.name}</p>
                        <p className="text-[10px] text-neutral-500 font-bold">
                          {doc.size} · Uploaded {doc.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-0.5 bg-black text-[#f5ce32] rounded text-[10px] font-mono font-black">
                        {doc.vectors}
                      </span>
                      <button
                        onClick={() => toast.success(`Re-embedding ${doc.name}...`)}
                        className="px-3 py-1 bg-white hover:bg-neutral-200 border border-black rounded-lg text-xs font-bold"
                      >
                        Re-index
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: AI ATTENDEE & FOUNDER MATCHMAKER */}
        {/* ========================================================================= */}
        {activeTab === 'matchmaker' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
                <div>
                  <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block mb-1">
                    AI NETWORKING ALGORITHM
                  </span>
                  <h2 className="text-2xl font-black uppercase text-black tracking-tight">
                    Serendipity & Founder Matchmaker
                  </h2>
                  <p className="text-xs font-bold text-neutral-600 mt-0.5">
                    Matches attendees based on GitHub tech stacks, ticket tiers, and track session selections.
                  </p>
                </div>

                <button
                  onClick={() => toast.success('Recalculated 12,000 attendee embeddings for optimal networking pairs!')}
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-[3px_3px_0px_#fff]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Matches</span>
                </button>
              </div>

              {/* Match Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {SAMPLE_MATCHES.map((profile) => (
                  <div
                    key={profile.id}
                    className="bg-[#fbfbf9] border-3 border-black rounded-3xl p-6 shadow-[5px_5px_0px_#000] flex flex-col justify-between hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                  >
                    <div>
                      {/* Avatar and Match Score */}
                      <div className="flex items-start justify-between mb-4">
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="w-14 h-14 rounded-2xl border-2 border-black object-cover shadow-[2px_2px_0px_#000]"
                        />
                        <div className="px-2.5 py-1 bg-emerald-400 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_#000]">
                          {profile.matchScore}% MATCH
                        </div>
                      </div>

                      <h3 className="text-lg font-black uppercase tracking-tight text-black leading-tight">
                        {profile.name}
                      </h3>
                      <p className="text-xs font-bold text-neutral-600 mt-0.5">
                        {profile.title} · <span className="text-black font-black">{profile.company}</span>
                      </p>

                      {/* Shared Interests */}
                      <div className="mt-4 pt-3 border-t-2 border-black/10">
                        <span className="text-[10px] font-black uppercase text-neutral-500 block mb-1.5">
                          Shared Tech Overlap:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.sharedInterests.map((interest, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-white border border-black rounded text-[10px] font-black text-black"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Reasoning */}
                      <p className="mt-3 text-[11px] font-bold text-neutral-700 bg-white p-2.5 rounded-xl border border-black leading-relaxed">
                        "{profile.whyMatch}"
                      </p>
                    </div>

                    <div className="mt-6 pt-2">
                      <button
                        onClick={() =>
                          toast.success(`Intro request sent to ${profile.name}! They will receive your profile via attendee app.`)
                        }
                        className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#f5ce32] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#f5ce32]" />
                        <span>Request Introduction</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 6. Footer */}
      <ConferioFooter />

      {/* Clerk Auth Modal */}
      <ClerkAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
