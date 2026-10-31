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
import {
  Sparkles,
  ArrowRight,
  Target,
  Zap,
  Globe2,
  Users,
  Award,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AboutPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('SIGN_IN');
  const [authContextMessage, setAuthContextMessage] = useState<string | undefined>();
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [isLikesDrawerOpen, setIsLikesDrawerOpen] = useState(false);
  const [myTickets, setMyTickets] = useState<ConfirmedPass[]>([]);
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());

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
          setAuthContextMessage('Sign in to book official summit passes.');
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
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-block px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm mb-4 border border-black shadow-[2px_2px_0px_#fff]">
            ★ ABOUT THE SUMMIT ★
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none mb-6">
            WE BELIEVE EVERY EVENT <br />
            <span className="underline decoration-black decoration-wavy decoration-2">
              SHOULD BE AN ODYSSEY
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-xl font-bold text-black/80 leading-snug">
            Event Sphere AI was founded on a simple conviction: technology conferences should be intensely creative, radically open, and engineered for real breakthrough conversations — not boring corporate speeches.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/schedule"
              className="px-6 py-3.5 bg-black text-[#f5ce32] hover:bg-neutral-800 border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center space-x-2"
            >
              <span>Explore 3-Day Schedule</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3.5 bg-white text-black hover:bg-neutral-100 border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <span>View Pass Options</span>
            </Link>
          </div>
        </div>

        {/* Neo-brutalist rotating badge */}
        <div className="hidden lg:flex absolute right-12 bottom-12 w-36 h-36 rounded-full border-4 border-black bg-white items-center justify-center shadow-[6px_6px_0px_#000] rotate-12">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">EST.</p>
            <p className="text-2xl font-black text-black">2026</p>
            <p className="text-[9px] font-black uppercase bg-[#f5ce32] px-2 py-0.5 border border-black rounded">
              LONDON, UK
            </p>
          </div>
        </div>
      </section>

      {/* 4. Gallery Strip */}
      <section className="bg-neutral-900 border-b-4 border-black py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80',
                caption: 'MAIN AUDITORIUM KEYNOTES',
              },
              {
                url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=700&q=80',
                caption: 'FOUNDER FIRESIDE SESSIONS',
              },
              {
                url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=700&q=80',
                caption: 'AI CODE LABS & HACK SPACES',
              },
              {
                url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80',
                caption: 'ROOFTOP NETWORKING SOIREE',
              },
            ].map((img, idx) => (
              <div
                key={idx}
                className="group relative border-3 border-black bg-white rounded-2xl overflow-hidden shadow-[4px_4px_0px_#f5ce32] hover:-translate-y-1 transition-transform"
              >
                <div className="h-48 sm:h-60 overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 bg-white border-t-2 border-black">
                  <p className="text-[10px] font-black uppercase text-black tracking-wider truncate">
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Core Manifesto (3 Pillar Cards) */}
      <section className="py-20 px-4 sm:px-8 border-b-4 border-black bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="px-3 py-1 bg-[#f5ce32] text-black text-xs font-black uppercase border-2 border-black rounded-sm shadow-[2px_2px_0px_#000]">
              OUR PILLARS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black mt-3">
              THE 3 LAWS OF EVENT SPHERE AI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#fbfbf9] border-3 border-black rounded-3xl shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <div className="w-12 h-12 bg-[#f5ce32] border-2 border-black rounded-2xl flex items-center justify-center mb-6 shadow-[2px_2px_0px_#000]">
                <Zap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">1. ZERO FLUFF</h3>
              <p className="text-xs font-bold text-neutral-600 leading-relaxed">
                No sponsored marketing slide-decks or vague panels. Every speaker commits to sharing real architectures, source code, revenue figures, and hard-earned war stories.
              </p>
            </div>

            <div className="p-8 bg-[#fbfbf9] border-3 border-black rounded-3xl shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <div className="w-12 h-12 bg-black text-white border-2 border-black rounded-2xl flex items-center justify-center mb-6 shadow-[2px_2px_0px_#f5ce32]">
                <Target className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">2. RADICAL CURATION</h3>
              <p className="text-xs font-bold text-neutral-600 leading-relaxed">
                We accept only 48 out of 620+ speaker submissions each year. Every presentation is rehearsed with technical curators to ensure maximum signal-to-noise ratio.
              </p>
            </div>

            <div className="p-8 bg-[#fbfbf9] border-3 border-black rounded-3xl shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <div className="w-12 h-12 bg-[#f5ce32] border-2 border-black rounded-2xl flex items-center justify-center mb-6 shadow-[2px_2px_0px_#000]">
                <Globe2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">3. MULTI-TENANT REACH</h3>
              <p className="text-xs font-bold text-neutral-600 leading-relaxed">
                Connecting 30+ regional tech organizations across Europe, Asia, and the Americas into a unified platform with decentralized badge ticketing and AI matching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Live Stats Matrix */}
      <section className="py-16 px-4 sm:px-8 bg-[#f5ce32] border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
              <p className="text-4xl sm:text-5xl font-black text-black">12K+</p>
              <p className="text-xs font-black uppercase text-neutral-700 mt-1">Global Attendees</p>
            </div>
            <div className="p-6 bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
              <p className="text-4xl sm:text-5xl font-black text-black">48</p>
              <p className="text-xs font-black uppercase text-neutral-700 mt-1">Keynote Sessions</p>
            </div>
            <div className="p-6 bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
              <p className="text-4xl sm:text-5xl font-black text-black">150+</p>
              <p className="text-xs font-black uppercase text-neutral-700 mt-1">Partner Brands</p>
            </div>
            <div className="p-6 bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
              <p className="text-4xl sm:text-5xl font-black text-black">99.8%</p>
              <p className="text-xs font-black uppercase text-neutral-700 mt-1">Satisfaction Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Organizers & Curators */}
      <section className="py-20 px-4 sm:px-8 border-b-4 border-black bg-[#fbfbf9]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase rounded-sm border border-black shadow-[2px_2px_0px_#fff]">
              THE STEERING COMMITTEE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black mt-3">
              MEET THE CURATORS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Elena Rostova',
                role: 'Executive Director',
                org: 'Ex-Google X',
                img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Marcus Sterling',
                role: 'Head of Technical Tracks',
                org: 'Scale Labs',
                img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Kavita Chawla',
                role: 'AI & ML Summit Chair',
                org: 'DeepMind Fellow',
                img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'David Chen',
                role: 'Production & Experience',
                org: 'Apex Stages',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
              },
            ].map((member, i) => (
              <div
                key={i}
                className="bg-white border-3 border-black rounded-3xl overflow-hidden shadow-[5px_5px_0px_#000] hover:-translate-y-1 transition-transform"
              >
                <div className="h-64 overflow-hidden border-b-2 border-black">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#f5ce32] text-black rounded border border-black inline-block mb-1">
                    {member.org}
                  </span>
                  <h3 className="text-base font-black uppercase text-black leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-neutral-500 mt-0.5">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call to Action */}
      <section className="py-20 px-4 sm:px-8 bg-black text-white text-center border-b-4 border-black">
        <div className="max-w-4xl mx-auto">
          <span className="px-3 py-1 bg-[#f5ce32] text-black text-xs font-black uppercase rounded-sm border border-white shadow-[2px_2px_0px_#fff]">
            LIMITED PASS AVAILABILITY
          </span>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mt-4 mb-6">
            SECURE YOUR PASS TODAY
          </h2>
          <p className="text-sm sm:text-base font-bold text-neutral-400 max-w-xl mx-auto mb-8">
            Join 12,000+ founders, engineers, and visionaries this January. Group passes and VIP passes sell out quickly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pricing"
              className="px-8 py-4 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Get Your Ticket Now
            </Link>
            <Link
              href="/schedule"
              className="px-8 py-4 bg-white text-black hover:bg-neutral-100 border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#f5ce32] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Check The Agenda
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <ConferioFooter />

      {/* Authentication Modal */}
      <ClerkAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        contextMessage={authContextMessage}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          toast.success('Signed in successfully!');
        }}
      />

      {/* Tickets Drawer */}
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
