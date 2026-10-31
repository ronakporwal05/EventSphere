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
  Search,
  Globe,
  Share2,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Speaker {
  id: string;
  name: string;
  role: string;
  org: string;
  topic: string;
  badge: 'KEYNOTE' | 'WORKSHOP' | 'PANEL' | 'FIRESIDE';
  category: 'AI Research' | 'Engineering' | 'Design & UX' | 'Security';
  img: string;
  bio: string;
}

const SPEAKERS_LIST: Speaker[] = [
  {
    id: 'sp1',
    name: 'Dr. Aris Vance',
    role: 'VP of AI Research',
    org: 'Synthetix Labs',
    topic: 'Autonomous Multi-Agent Swarms in Distributed Systems',
    badge: 'KEYNOTE',
    category: 'AI Research',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Former DeepMind principal scientist leading breakthrough research in decentralized reinforcement learning and inference optimization.',
  },
  {
    id: 'sp2',
    name: 'Maya Lin',
    role: 'Principal Architect',
    org: 'CloudScale',
    topic: 'Low-Latency Streaming Pipelines at 10M QPS',
    badge: 'KEYNOTE',
    category: 'Engineering',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bio: 'Pioneered low-overhead zero-copy stream processing architectures serving over 80 million global users.',
  },
  {
    id: 'sp3',
    name: 'Marcus Sterling',
    role: 'Founder & CEO',
    org: 'Apex Engine',
    topic: 'The Next Generation of Generative UI & Edge Runtimes',
    badge: 'FIRESIDE',
    category: 'Design & UX',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'Serial entrepreneur and design systems veteran transforming static enterprise software into dynamic, conversational interfaces.',
  },
  {
    id: 'sp4',
    name: 'Kavita Chawla',
    role: 'AI Chair',
    org: 'VectorFlow',
    topic: 'Vector DB Benchmarks: 100M Embeddings in Production',
    badge: 'WORKSHOP',
    category: 'AI Research',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Author of "Scaling Vector Search". Advises Fortune 500 engineering teams on retrieval-augmented generation at hyperscale.',
  },
  {
    id: 'sp5',
    name: 'Tariq Al-Mansoor',
    role: 'Chief Security Officer',
    org: 'Fortify AI',
    topic: 'Multi-Tenant Security: Hardware Enclaves & Row Security',
    badge: 'KEYNOTE',
    category: 'Security',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: '20+ years securing cryptographic infrastructure and cross-border financial networks against state-sponsored intrusion.',
  },
  {
    id: 'sp6',
    name: 'Chloe Dubois',
    role: 'VP of Product Design',
    org: 'Linear Studio',
    topic: 'Brutalist & Functionalist Interfaces for 2026',
    badge: 'PANEL',
    category: 'Design & UX',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    bio: 'Leading modern design systems across modern developer tools and high-velocity product teams worldwide.',
  },
  {
    id: 'sp7',
    name: 'Siddharth Sen',
    role: 'Head of Developer Platform',
    org: 'AutoCoder',
    topic: 'Hands-on Multi-Agent Sandboxing & Test Environments',
    badge: 'WORKSHOP',
    category: 'Engineering',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    bio: 'Creator of popular open-source toolchains for deterministic LLM agent execution and live memory snapshots.',
  },
  {
    id: 'sp8',
    name: 'Zoe Nakamura',
    role: 'Head of Infrastructure',
    org: 'Tokyo Edge Lab',
    topic: 'Global Anycast Routing & Kubernetes Bare-Metal Fleets',
    badge: 'KEYNOTE',
    category: 'Engineering',
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    bio: 'Architect of sub-10ms global anycast fabrics connecting 140 data centers worldwide.',
  },
];

export default function SpeakersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('SIGN_IN');
  const [authContextMessage, setAuthContextMessage] = useState<string | undefined>();
  const [selectedSpeakerForMeeting, setSelectedSpeakerForMeeting] = useState<Speaker | null>(null);

  // Tickets and Likes drawer states
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [isLikesDrawerOpen, setIsLikesDrawerOpen] = useState(false);
  const [myTickets, setMyTickets] = useState<ConfirmedPass[]>([]);
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());

  const filteredSpeakers = SPEAKERS_LIST.filter((sp) => {
    if (selectedCategory !== 'All' && sp.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !sp.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !sp.org.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !sp.topic.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleBookOfficeHours = (speaker: Speaker) => {
    if (useAuthStore.getState().isAuthenticated) {
      toast.success(`1-on-1 Office Hours requested with ${speaker.name}! Check your email for booking slot options.`);
    } else {
      setSelectedSpeakerForMeeting(speaker);
      setAuthContextMessage(`Sign in with Google to schedule 1-on-1 speaker office hours with ${speaker.name}.`);
      setAuthModalMode('SIGN_IN');
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (selectedSpeakerForMeeting) {
      toast.success(`1-on-1 Office Hours requested with ${selectedSpeakerForMeeting.name}!`);
      setSelectedSpeakerForMeeting(null);
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
            ★ THE 2026 LINEUP ★
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none mb-4">
            WORLD-CLASS MINDS & <br />
            <span className="underline decoration-black decoration-wavy decoration-2">
              KEYNOTE VISIONARIES
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg font-bold text-black/80">
            Meet 48+ groundbreaking architects, AI scientists, and venture leaders sharing unvarnished engineering truths, live code, and industry forecasts.
          </p>
        </div>
      </section>

      {/* 4. Controls Bar */}
      <section className="bg-white border-b-4 border-black py-6 px-4 sm:px-8 sticky top-16 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['All', 'AI Research', 'Engineering', 'Design & UX', 'Security'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#f5ce32] text-black shadow-[2px_2px_0px_#000]'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search speaker by name, company, or topic..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black placeholder-neutral-500 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
            />
          </div>
        </div>
      </section>

      {/* 5. Speakers Grid */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredSpeakers.map((speaker) => (
            <div
              key={speaker.id}
              className="group bg-white border-3 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Neo-brutalist Badges */}
                <div className="relative h-72 sm:h-80 overflow-hidden border-b-3 border-black bg-neutral-900">
                  <img
                    src={speaker.img}
                    alt={speaker.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                  />
                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#f5ce32] text-black text-[10px] font-black uppercase tracking-wider rounded border-2 border-black shadow-[2px_2px_0px_#000]">
                    {speaker.badge}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-wider rounded border border-white">
                    {speaker.category}
                  </div>
                </div>

                {/* Speaker Info */}
                <div className="p-5 space-y-2.5">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-black leading-tight">
                      {speaker.name}
                    </h3>
                    <p className="text-xs font-bold text-neutral-500 mt-0.5">
                      {speaker.role} · <span className="text-black font-black">{speaker.org}</span>
                    </p>
                  </div>

                  {/* Talk Topic Box */}
                  <div className="p-3 bg-neutral-50 border-2 border-black rounded-xl">
                    <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">
                      Speaking On:
                    </p>
                    <p className="text-xs font-black text-black leading-snug mt-0.5">
                      "{speaker.topic}"
                    </p>
                  </div>

                  <p className="text-[11px] font-bold text-neutral-600 line-clamp-3 leading-relaxed">
                    {speaker.bio}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => handleBookOfficeHours(speaker)}
                  className="w-full py-2.5 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#f5ce32] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Book Office Hours</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Call for Papers / Apply to Speak */}
      <section className="py-16 px-4 sm:px-8 bg-neutral-900 border-t-4 border-b-4 border-black text-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="px-3 py-1 bg-[#f5ce32] text-black text-xs font-black uppercase rounded-sm border border-white shadow-[2px_2px_0px_#fff]">
            SPEAKER SUBMISSIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            WANT TO TAKE THE STAGE IN 2026?
          </h2>
          <p className="text-xs sm:text-sm font-bold text-neutral-400 max-w-xl mx-auto">
            We are always looking for visionary practitioners with groundbreaking engineering stories. Submissions for lightning talks and workshop sessions are open.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                toast.info('Speaker CFP portal opening for late round submissions. Stay tuned!');
              }}
              className="px-6 py-3 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all inline-flex items-center space-x-2"
            >
              <span>Submit Speaker Proposal</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <ConferioFooter />

      {/* Authentication Modal */}
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
