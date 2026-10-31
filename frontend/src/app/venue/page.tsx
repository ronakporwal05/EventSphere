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
  MapPin,
  Train,
  Plane,
  Car,
  Hotel,
  Mail,
  Phone,
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export default function VenueContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('SIGN_IN');

  // Drawers
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [isLikesDrawerOpen, setIsLikesDrawerOpen] = useState(false);
  const [myTickets, setMyTickets] = useState<ConfirmedPass[]>([]);
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast.success('Your message has been dispatched to the EventSphere AI Operations Desk. We will respond within 4 hours.');
    setName('');
    setEmail('');
    setMessage('');
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
          setIsAuthModalOpen(true);
        }}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        likedCount={likedEventIds.size}
        ticketCount={myTickets.length}
      />

      {/* 3. Hero Header Section */}
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-14 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm mb-4 border border-black shadow-[2px_2px_0px_#fff]">
            ★ LOCATION & CONTACT ★
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none mb-4">
            VENUE & LOGISTICS // <br />
            <span className="underline decoration-black decoration-wavy decoration-2">
              EXCEL ARENA LONDON
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg font-bold text-black/80">
            Royal Victoria Dock, 1 Western Gateway, London E16 1XL. Connected via Elizabeth Line, DLR, and London City Airport.
          </p>
        </div>
      </section>

      {/* 4. Interactive Venue Map & Address Card */}
      <section className="py-14 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Map Representation (7 Cols) */}
          <div className="lg:col-span-7 bg-white border-3 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_#000] flex flex-col">
            <div className="bg-[#f5ce32] p-4 border-b-2 border-black flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-black" />
                <span>EXCEL LONDON ARENA (51.5074° N, 0.0278° E)</span>
              </span>
              <span className="text-[10px] font-black uppercase bg-black text-[#f5ce32] px-2 py-0.5 rounded">
                WEST ENTRANCE
              </span>
            </div>

            {/* Stylized Neo-brutalist Map Visual */}
            <div className="relative h-72 sm:h-96 bg-[#eef1e6] border-b-2 border-black overflow-hidden flex items-center justify-center p-6">
              {/* Map Grid Pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(#000 1.5px, transparent 1.5px), radial-gradient(#000 1.5px, #eef1e6 1.5px)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px',
                }}
              />

              {/* Central Venue Marker Card */}
              <div className="relative z-10 bg-white border-3 border-black rounded-2xl p-4 text-center shadow-[4px_4px_0px_#000] max-w-xs animate-bounce duration-1000">
                <div className="w-10 h-10 bg-[#f5ce32] text-black border-2 border-black rounded-xl flex items-center justify-center mx-auto mb-2 font-black shadow-[2px_2px_0px_#000]">
                  ★
                </div>
                <h4 className="text-xs font-black uppercase text-black">EventSphere AI 2026 Summit</h4>
                <p className="text-[10px] text-neutral-600 font-bold mt-0.5">
                  ExCeL London — Hall 1 & 2
                </p>
                <div className="mt-2 text-[9px] font-black uppercase px-2 py-0.5 bg-black text-[#f5ce32] rounded">
                  MAIN TURNSTILE GATES
                </div>
              </div>
            </div>

            {/* Address Footer Strip */}
            <div className="p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-black">ExCeL London Arena</p>
                <p className="text-xs font-bold text-neutral-600">Royal Victoria Dock, London E16 1XL</p>
              </div>
              <a
                href="https://maps.google.com/?q=ExCeL+London"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#f5ce32] inline-flex items-center space-x-1.5 shrink-0"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right: Contact Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000]">
            <div className="mb-6 pb-3 border-b-2 border-black">
              <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block mb-1">
                24/7 DESK
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                GET IN TOUCH
              </h2>
              <p className="text-xs font-bold text-neutral-600 mt-0.5">
                Questions about tickets, hotel bookings, or accessibility?
              </p>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ronak Verma"
                  required
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ronak@example.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                  Inquiry Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_#000]"
                >
                  <option value="General Inquiry">General Summit Questions</option>
                  <option value="VIP Ticketing">VIP & Executive Pass Concierge</option>
                  <option value="Sponsorship">Sponsorship & Exhibition Booths</option>
                  <option value="Press Access">Press & Media Accreditation</option>
                  <option value="Accessibility">Accessibility & Special Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                  Message
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our operations team assist you?"
                  required
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-2"
              >
                <span>{sending ? 'Sending Message...' : 'Send Message to Desk'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 5. Transit & Travel Connections */}
      <section className="py-14 px-4 sm:px-8 bg-white border-t-4 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <span className="px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase rounded-sm border border-black shadow-[2px_2px_0px_#fff]">
              TRAVEL GUIDE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black mt-3">
              HOW TO REACH EVENT SPHERE AI
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#fbfbf9] border-3 border-black rounded-3xl shadow-[4px_4px_0px_#000]">
              <div className="w-10 h-10 bg-[#98d8ef] text-black border-2 border-black rounded-xl flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000]">
                <Train className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Elizabeth Line</h3>
              <p className="text-xs font-bold text-neutral-600 mt-1">
                Custom House Station is directly connected to the ExCeL entrance. Just 12 minutes from Central London (Liverpool Street).
              </p>
            </div>

            <div className="p-6 bg-[#fbfbf9] border-3 border-black rounded-3xl shadow-[4px_4px_0px_#000]">
              <div className="w-10 h-10 bg-[#f5ce32] text-black border-2 border-black rounded-xl flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000]">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase text-black">London City Airport</h3>
              <p className="text-xs font-bold text-neutral-600 mt-1">
                LCY is 5 minutes from the venue by taxi or 1 stop on the DLR. Heathrow is 45 minutes direct via Elizabeth Line.
              </p>
            </div>

            <div className="p-6 bg-[#fbfbf9] border-3 border-black rounded-3xl shadow-[4px_4px_0px_#000]">
              <div className="w-10 h-10 bg-[#e5d4ff] text-black border-2 border-black rounded-xl flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000]">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Driving & Parking</h3>
              <p className="text-xs font-bold text-neutral-600 mt-1">
                Easy access via the A13 and A406. On-site secure parking for 3,000+ vehicles with high-speed EV charging bays.
              </p>
            </div>

            <div className="p-6 bg-[#fbfbf9] border-3 border-black rounded-3xl shadow-[4px_4px_0px_#000]">
              <div className="w-10 h-10 bg-emerald-300 text-black border-2 border-black rounded-xl flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000]">
                <Hotel className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Partner Hotels</h3>
              <p className="text-xs font-bold text-neutral-600 mt-1">
                Aloft & Novotel ExCeL offer 25% attendee discounts with code <span className="font-mono font-black text-black">EVENTSPHERE26</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <ConferioFooter />

      {/* Clerk Auth Modal */}
      <ClerkAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => setIsAuthModalOpen(false)}
      />

      {/* Drawers */}
      <MyTicketsModal
        isOpen={isTicketsModalOpen}
        onClose={() => setIsTicketsModalOpen(false)}
        tickets={myTickets}
      />
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
