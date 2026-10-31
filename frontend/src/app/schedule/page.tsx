'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ConferioTicker } from '@/features/conferio/components/ConferioTicker';
import { ConferioNavbar } from '@/features/conferio/components/ConferioNavbar';
import { ConferioFooter } from '@/features/conferio/components/ConferioFooter';
import { ClerkAuthModal, AuthModalMode } from '@/features/auth/components/ClerkAuthModal';
import { MyTicketsModal, ConfirmedPass } from '@/features/eventbrite/components/MyTicketsModal';
import { SavedLikesDrawer } from '@/features/eventbrite/components/SavedLikesDrawer';
import { FLAGSHIP_EVENT } from '@/features/conferio/data/flagship';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Download,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface SessionItem {
  id: string;
  day: number;
  time: string;
  title: string;
  description: string;
  speaker: string;
  speakerRole: string;
  speakerImg: string;
  room: string;
  track: 'Keynote' | 'AI & ML' | 'Engineering' | 'Workshops' | 'Networking';
  capacity: number;
  reservedCount: number;
}

const SCHEDULE_DATA: SessionItem[] = [
  // Day 1
  {
    id: 's1',
    day: 1,
    time: '09:00 AM - 10:15 AM',
    title: 'Opening Keynote: The Autonomous Era & Decentralized Systems',
    description: 'A deep dive into how multi-agent swarms and decentralized compute are fundamentally rewriting enterprise engineering in 2026.',
    speaker: 'Dr. Aris Vance',
    speakerRole: 'VP of AI Research, Synthetix Labs',
    speakerImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    room: 'Hall A — Main Auditorium',
    track: 'Keynote',
    capacity: 2500,
    reservedCount: 2180,
  },
  {
    id: 's2',
    day: 1,
    time: '10:45 AM - 12:00 PM',
    title: 'Zero-Latency Real-Time Streaming at 10M QPS',
    description: 'Architecting resilient Kafka & Rust pipelines under extreme throughput spikes without single-point bottlenecks.',
    speaker: 'Maya Lin',
    speakerRole: 'Principal Architect, CloudScale',
    speakerImg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    room: 'Stage 2 — Cloud & Infra',
    track: 'Engineering',
    capacity: 800,
    reservedCount: 740,
  },
  {
    id: 's3',
    day: 1,
    time: '01:30 PM - 03:00 PM',
    title: 'Hands-on Workshop: Fine-Tuning Domain LLMs with LoRA & Qdrant',
    description: 'Bring your laptop. Interactive workshop running quantized inference, vector search embeddings, and evaluation benchmarks.',
    speaker: 'Kavita Chawla',
    speakerRole: 'AI & ML Summit Chair',
    speakerImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    room: 'Lab B — Interactive Studio',
    track: 'Workshops',
    capacity: 250,
    reservedCount: 245,
  },
  {
    id: 's4',
    day: 1,
    time: '03:30 PM - 05:00 PM',
    title: 'Multi-Tenant Security Architecture: Isolation vs Shared Efficiency',
    description: 'Postgres row-level security, separate schema partitioning, and dynamic tenant resolution in distributed microservices.',
    speaker: 'Tariq Al-Mansoor',
    speakerRole: 'Chief Security Officer, Fortify AI',
    speakerImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    room: 'Stage 3 — Cyber & Systems',
    track: 'Engineering',
    capacity: 600,
    reservedCount: 490,
  },
  {
    id: 's5',
    day: 1,
    time: '05:30 PM - 07:30 PM',
    title: 'Opening Night VIP Networking & Drinks Soiree',
    description: 'Rooftop cocktail mixer with speakers, founders, and VC partners overlooking the London skyline.',
    speaker: 'EventSphere AI Hosts',
    speakerRole: 'Hospitality & VIP Concierge',
    speakerImg: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80',
    room: 'Skyline Terrace — Level 5',
    track: 'Networking',
    capacity: 1200,
    reservedCount: 1050,
  },

  // Day 2
  {
    id: 's6',
    day: 2,
    time: '09:30 AM - 10:45 AM',
    title: 'Keynote: Next-Generation Frontend & Agentic UI Paradigms',
    description: 'How generative UI components, streaming SSR, and edge execution are replacing traditional static interfaces.',
    speaker: 'Marcus Sterling',
    speakerRole: 'Founder, Apex Engine',
    speakerImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    room: 'Hall A — Main Auditorium',
    track: 'Keynote',
    capacity: 2500,
    reservedCount: 1980,
  },
  {
    id: 's7',
    day: 2,
    time: '11:15 AM - 12:45 PM',
    title: 'Vector Databases in Production: Lessons from 100M Embedding Vectors',
    description: 'HNSW indexing nuances, quantization trade-offs, and live similarity search benchmarks with Qdrant.',
    speaker: 'Elena Rostova',
    speakerRole: 'Data Architect, VectorFlow',
    speakerImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    room: 'Stage 2 — Data Infrastructure',
    track: 'AI & ML',
    capacity: 900,
    reservedCount: 820,
  },
  {
    id: 's8',
    day: 2,
    time: '02:00 PM - 03:30 PM',
    title: 'Interactive Lab: Building Autonomous Coding Agents',
    description: 'Architecting multi-agent execution loops with sandboxed environments, file access tools, and test suites.',
    speaker: 'Siddharth Sen',
    speakerRole: 'Head of Engineering, AutoCoder',
    speakerImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    room: 'Lab A — Dev Zone',
    track: 'Workshops',
    capacity: 300,
    reservedCount: 298,
  },

  // Day 3
  {
    id: 's9',
    day: 3,
    time: '10:00 AM - 11:30 AM',
    title: 'Startup Pitch Arena: Top 10 Emerging AI & Infrastructure Startups',
    description: 'Selected founders pitch live on stage to a panel of tier-1 venture partners with $500K in investment prizes.',
    speaker: 'Investor Syndicate Panel',
    speakerRole: 'Sequoia, Index, & Accel Partners',
    speakerImg: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=400&q=80',
    room: 'Hall A — Main Auditorium',
    track: 'Keynote',
    capacity: 2500,
    reservedCount: 2300,
  },
  {
    id: 's10',
    day: 3,
    time: '01:00 PM - 03:00 PM',
    title: 'Hands-on Hackathon Demos & Awards Gala',
    description: 'Showcasing the top hacks built during the 48-hour EventSphere AI Hackathon. Live voting and trophy ceremony.',
    speaker: 'EventSphere AI Hack Committee',
    speakerRole: 'Judges & Mentors',
    speakerImg: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80',
    room: 'Main Arena Stage',
    track: 'Workshops',
    capacity: 2000,
    reservedCount: 1650,
  },
];

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reservedSessionIds, setReservedSessionIds] = useState<Set<string>>(new Set());

  // Auth modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('SIGN_IN');
  const [authContextMessage, setAuthContextMessage] = useState<string | undefined>();
  const [pendingSessionToReserve, setPendingSessionToReserve] = useState<SessionItem | null>(null);

  // Tickets and Likes drawer states
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [isLikesDrawerOpen, setIsLikesDrawerOpen] = useState(false);
  const [myTickets, setMyTickets] = useState<ConfirmedPass[]>([]);
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());

  // Filter sessions
  const filteredSessions = SCHEDULE_DATA.filter((s) => {
    if (s.day !== selectedDay) return false;
    if (selectedTrack !== 'All' && s.track !== selectedTrack) return false;
    if (
      searchQuery &&
      !s.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.speaker.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Handle Reserve Session with Systematic Auth Gating
  const handleReserve = (session: SessionItem) => {
    if (useAuthStore.getState().isAuthenticated) {
      toggleReserve(session.id, session.title);
    } else {
      setPendingSessionToReserve(session);
      setAuthContextMessage(`Sign in with Google to reserve your guaranteed seat for "${session.title}".`);
      setAuthModalMode('SIGN_IN');
      setIsAuthModalOpen(true);
    }
  };

  const toggleReserve = (sessionId: string, title: string) => {
    setReservedSessionIds((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
        toast.info(`Reservation released for "${title}"`);
      } else {
        next.add(sessionId);
        toast.success(`Guaranteed seat reserved for "${title}"! Added to your schedule.`);
      }
      return next;
    });
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (pendingSessionToReserve) {
      toggleReserve(pendingSessionToReserve.id, pendingSessionToReserve.title);
      setPendingSessionToReserve(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
      {/* 1. Marquee Ticker */}
      <ConferioTicker />

      {/* 2. Sticky Navbar */}
      <ConferioNavbar
        onOpenTickets={() => setIsTicketsModalOpen(true)}
        onOpenLikes={() => setIsLikesDrawerOpen(true)}
        onBuyTicketClick={() => {
          setAuthModalMode('SIGN_IN');
          setAuthContextMessage('Sign in to purchase summit passes.');
          setIsAuthModalOpen(true);
        }}
        onOpenAuth={(mode, context) => {
          setAuthModalMode(mode);
          setAuthContextMessage(context);
          setIsAuthModalOpen(true);
        }}
        likedCount={likedEventIds.size}
        ticketCount={myTickets.length}
      />

      {/* 3. Hero Header Section */}
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-14 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm mb-4 border border-black shadow-[2px_2px_0px_#fff]">
            ★ SUMMIT TIMETABLE ★
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none mb-4">
            OFFICIAL 3-DAY AGENDA <br />
            <span className="underline decoration-black decoration-wavy decoration-2">
              & STAGE TIMETABLE
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg font-bold text-black/80">
            Browse 48+ world-class keynotes, deep-dive technical workshops, and VIP networking mixers. Reserve your guaranteed seat before capacities fill.
          </p>
        </div>
      </section>

      {/* 4. Filter & Day Selector Controls */}
      <section className="bg-white border-b-4 border-black py-6 px-4 sm:px-8 sticky top-16 z-30 shadow-md">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Day Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {[
              { day: 1, label: 'DAY 1 // JAN 22', theme: 'AI & Autonomous Systems' },
              { day: 2, label: 'DAY 2 // JAN 23', theme: 'Scale & Frontend Paradigms' },
              { day: 3, label: 'DAY 3 // JAN 24', theme: 'Startup Gala & Hackathon' },
            ].map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={`px-5 py-3 border-2 border-black rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] ${
                  selectedDay === d.day
                    ? 'bg-black text-[#f5ce32] shadow-[3px_3px_0px_#f5ce32]'
                    : 'bg-white hover:bg-neutral-100 text-black'
                }`}
              >
                <div>{d.label}</div>
                <div className="text-[10px] font-bold opacity-75">{d.theme}</div>
              </button>
            ))}
          </div>

          {/* Track Filters and Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            {/* Track Pills */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Keynote', 'AI & ML', 'Engineering', 'Workshops', 'Networking'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTrack(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                    selectedTrack === t
                      ? 'bg-[#f5ce32] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search speaker, topic, or stage..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black placeholder-neutral-500 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Schedule Cards List */}
      <section className="py-12 px-4 sm:px-8 max-w-6xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-black">
          <div>
            <span className="text-xs font-black uppercase text-neutral-500 tracking-wider">
              DISPLAYING {filteredSessions.length} SESSIONS FOR DAY {selectedDay}
            </span>
          </div>
          <button
            onClick={() => {
              toast.success('Calendar downloaded! iCal / Google Calendar sync file ready.');
            }}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white border-2 border-black rounded-lg text-xs font-black uppercase shadow-[2px_2px_0px_#000] hover:bg-neutral-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sync iCal</span>
          </button>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center bg-white border-3 border-black rounded-3xl shadow-[6px_6px_0px_#000]">
            <p className="text-xl font-black uppercase text-black">No sessions found</p>
            <p className="text-xs text-neutral-500 font-bold mt-1">
              Try adjusting your track filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSessions.map((session) => {
              const isReserved = reservedSessionIds.has(session.id);
              const capacityPercent = Math.round((session.reservedCount / session.capacity) * 100);

              return (
                <div
                  key={session.id}
                  className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                  {/* Left: Time & Stage badge */}
                  <div className="md:w-64 shrink-0 space-y-3">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-black text-[#f5ce32] rounded-lg text-xs font-black tracking-wider uppercase border border-black shadow-[2px_2px_0px_#f5ce32]">
                      <Clock className="w-3.5 h-3.5 text-[#f5ce32]" />
                      <span>{session.time}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-700">
                      <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                      <span>{session.room}</span>
                    </div>

                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black">
                        {session.track}
                      </span>
                    </div>

                    {/* Capacity Indicator */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-neutral-500 mb-1">
                        <span>Capacity</span>
                        <span>{capacityPercent}% Reserved</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden border border-black">
                        <div
                          className="bg-black h-full"
                          style={{ width: `${capacityPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Middle: Content & Speaker */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black leading-snug">
                      {session.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-neutral-600 leading-relaxed">
                      {session.description}
                    </p>

                    {/* Speaker Avatar Pill */}
                    <div className="flex items-center space-x-3 pt-2">
                      <img
                        src={session.speakerImg}
                        alt={session.speaker}
                        className="w-10 h-10 rounded-full border-2 border-black object-cover shadow-[2px_2px_0px_#000]"
                      />
                      <div>
                        <p className="text-xs font-black uppercase text-black">{session.speaker}</p>
                        <p className="text-[10px] font-bold text-neutral-500">{session.speakerRole}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Reserve Action Button */}
                  <div className="shrink-0 flex flex-col justify-center">
                    <button
                      onClick={() => handleReserve(session)}
                      className={`w-full sm:w-44 py-3 px-4 border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-2 ${
                        isReserved
                          ? 'bg-emerald-400 text-black shadow-[3px_3px_0px_#000]'
                          : 'bg-black text-[#f5ce32] hover:bg-neutral-800'
                      }`}
                    >
                      {isReserved ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
                          <span>Reserved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4 text-[#f5ce32]" />
                          <span>Reserve Seat</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. Footer */}
      <ConferioFooter />

      {/* Auth Modal with Gating */}
      <ClerkAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        contextMessage={authContextMessage}
        onSuccess={handleAuthSuccess}
      />

      {/* My Tickets Drawer */}
      <MyTicketsModal
        isOpen={isTicketsModalOpen}
        onClose={() => setIsTicketsModalOpen(false)}
        tickets={myTickets}
      />

      {/* Saved Likes Drawer */}
      <SavedLikesDrawer
        isOpen={isLikesDrawerOpen}
        onClose={() => setIsLikesDrawerOpen(false)}
        likedEvents={[FLAGSHIP_EVENT]}
        onRemoveLike={(id: string) => {
          setLikedEventIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }}
        onBookTickets={() => {
          setIsLikesDrawerOpen(false);
          window.location.href = '/pricing';
        }}
      />
    </div>
  );
}
