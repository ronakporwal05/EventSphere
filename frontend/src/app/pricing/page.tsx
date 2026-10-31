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
import { InteractiveSeatMap, SelectedSeat } from '@/features/tickets/components/InteractiveSeatMap';
import { PaymentGatewayModal } from '@/features/tickets/components/PaymentGatewayModal';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import {
  Check,
  X as XIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  CreditCard,
  Zap,
  HelpCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';

interface PassTier {
  id: string;
  name: string;
  tagline: string;
  price: number;
  badge?: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
  shadowColor: string;
  features: string[];
}

const PASS_TIERS: PassTier[] = [
  {
    id: 'tier-gen-02',
    name: 'Attendee Pass',
    tagline: 'Standard 3-Day Summit Admission',
    price: 99,
    colorBg: 'bg-[#e5d4ff]',
    colorText: 'text-black',
    colorBorder: 'border-black',
    shadowColor: '#000',
    features: [
      'Access to All 48 Keynotes & Stages',
      'General Admission Seating',
      'Exhibition Hall & Partner Booths',
      'Official Event Sphere AI 2026 Swag Kit',
      'Standard Lunch & Refreshments',
      'Access to Official Attendee App',
    ],
  },
  {
    id: 'tier-vip-01',
    name: 'VIP All-Access',
    tagline: 'Premier Reserved Front Seating & Networking',
    price: 159,
    badge: 'MOST POPULAR // ★★★★★',
    colorBg: 'bg-black',
    colorText: 'text-white',
    colorBorder: 'border-black',
    shadowColor: '#f5ce32',
    features: [
      'Everything in Attendee Pass, plus:',
      'Front-Row Reserved Keynote Seating',
      'Rooftop VIP Opening Soiree Access',
      'Fast-Track Turnstile Check-In Gate',
      'Speaker Lounge & Dedicated Workstations',
      'Curated Gourmet Lunch & Evening Cocktails',
      'All Recorded Session Replays (4K Ultra HD)',
    ],
  },
  {
    id: 'tier-dev-vip',
    name: 'Executive & Investor',
    tagline: 'Exclusive 1-on-1 Access & Boardroom Dinners',
    price: 299,
    badge: 'EXCLUSIVE // LIMITED TO 150',
    colorBg: 'bg-[#98d8ef]',
    colorText: 'text-black',
    colorBorder: 'border-black',
    shadowColor: '#000',
    features: [
      'Everything in VIP All-Access, plus:',
      '1-on-1 Guaranteed Speaker Office Hours',
      'Private Executive Boardroom Lunch',
      'Investor & Founder Matchmaking Hub',
      'Dedicated Chauffeur Airport Transfer',
      'Permanent Lifetime Video Vault Access',
      'Custom Commemorative Metal QR Badge',
    ],
  },
];

const COMPARISON_ROWS = [
  { feature: '3-Day Stage Access (All 48 Talks)', attendee: true, vip: true, exec: true },
  { feature: 'Exhibition & Demo Zones', attendee: true, vip: true, exec: true },
  { feature: 'Attendee Mobile Networking App', attendee: true, vip: true, exec: true },
  { feature: 'Fast-Track Turnstile Entry Gate', attendee: false, vip: true, exec: true },
  { feature: 'Reserved VIP Mainstage Seating', attendee: false, vip: true, exec: true },
  { feature: 'Rooftop Opening Cocktail Soiree', attendee: false, vip: true, exec: true },
  { feature: '4K Session Replays & Transcripts', attendee: false, vip: true, exec: true },
  { feature: 'Gourmet Dining & VIP Lounge', attendee: false, vip: true, exec: true },
  { feature: '1-on-1 Speaker Office Hours', attendee: false, vip: false, exec: true },
  { feature: 'Private Founder-Investor Boardroom', attendee: false, vip: false, exec: true },
  { feature: 'Airport Chauffeur Transfer', attendee: false, vip: false, exec: true },
];

export default function PricingPage() {
  const [groupCount, setGroupCount] = useState<number>(1);
  const [selectedTierForBooking, setSelectedTierForBooking] = useState<PassTier>(PASS_TIERS[1]);

  // Auth modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('SIGN_IN');
  const [authContextMessage, setAuthContextMessage] = useState<string | undefined>();
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Seat map & payment modals
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSeatString, setSelectedSeatString] = useState<string | undefined>();

  // Tickets and Likes drawers
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [isLikesDrawerOpen, setIsLikesDrawerOpen] = useState(false);
  const [myTickets, setMyTickets] = useState<ConfirmedPass[]>([]);
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());

  // Gated action executor
  const executeWithAuth = (action: () => void, contextMsg?: string) => {
    if (useAuthStore.getState().isAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setAuthContextMessage(contextMsg || 'Please sign in with Google to purchase passes.');
      setAuthModalMode('SIGN_IN');
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (pendingAction) {
      const act = pendingAction;
      setPendingAction(null);
      act();
    }
  };

  // Booking a tier: opens interactive seat map
  const handleBookTier = (tier: PassTier) => {
    executeWithAuth(() => {
      setSelectedTierForBooking(tier);
      setIsSeatMapOpen(true);
    }, `Sign in with Google to complete registration for ${tier.name}.`);
  };

  // Seat selection confirmed -> Transition to payment modal
  const handleConfirmSeats = (seats: SelectedSeat[]) => {
    setIsSeatMapOpen(false);
    if (seats.length > 0) {
      const seatNames = seats.map((s) => `${s.row}-${s.number}`).join(', ');
      setSelectedSeatString(seatNames);
      setIsPaymentModalOpen(true);
      toast.success(`Reserved seat: ${seatNames}. Loading secure payment gateway...`);
    } else {
      setSelectedSeatString(undefined);
      setIsPaymentModalOpen(true);
    }
  };

  // Payment success handler -> Adds to ticket wallet
  const handlePaymentSuccess = (ticketData?: any) => {
    setIsPaymentModalOpen(false);
    const newPass: ConfirmedPass = {
      id: `pass-${Date.now()}`,
      ticketNumber: ticketData?.ticketId || `TCK-ES-${Math.floor(1000 + Math.random() * 9000)}`,
      eventTitle: `Event Sphere AI 2026 (${selectedTierForBooking.name})`,
      date: 'JAN 22-24, 2026',
      location: 'ExCeL Arena, London, UK',
      tier: selectedTierForBooking.name,
      seat: selectedSeatString || 'General Hall',
      price: selectedTierForBooking.price,
      status: 'CONFIRMED',
    };
    setMyTickets((prev) => [newPass, ...prev]);
    toast.success('Pass confirmed! Your official QR Ticket Pass has been generated.');
    setIsTicketsModalOpen(true);
  };

  // Group discount calculation
  const discountRate = groupCount >= 10 ? 0.2 : groupCount >= 5 ? 0.15 : groupCount >= 3 ? 0.1 : 0;
  const unitPrice = selectedTierForBooking.price;
  const subtotal = unitPrice * groupCount;
  const discountAmount = subtotal * discountRate;
  const finalTotal = subtotal - discountAmount;

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
      {/* 1. Marquee Ticker */}
      <ConferioTicker />

      {/* 2. Sticky Navbar */}
      <ConferioNavbar
        onOpenTickets={() => setIsTicketsModalOpen(true)}
        onOpenLikes={() => setIsLikesDrawerOpen(true)}
        onBuyTicketClick={() => handleBookTier(PASS_TIERS[1])}
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
            ★ TICKETS & PASSES ★
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none mb-4">
            CHOOSE YOUR PASS & <br />
            <span className="underline decoration-black decoration-wavy decoration-2">
              SEAT TIER FOR 2026
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg font-bold text-black/80">
            All passes include guaranteed entry to 48 keynote sessions, exhibition floors, partner hack zones, and instant digital QR badges.
          </p>
        </div>
      </section>

      {/* 4. Three Pass Cards Grid */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PASS_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative ${tier.colorBg} ${tier.colorText} border-4 ${tier.colorBorder} rounded-3xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}
            >
              {/* Optional Badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#f5ce32] text-black text-[10px] font-black uppercase tracking-wider rounded-full border-2 border-black shadow-[2px_2px_0px_#000]">
                  {tier.badge}
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight leading-tight">
                      {tier.name}
                    </h2>
                    <p className={`text-xs font-bold mt-1 ${tier.colorText === 'text-white' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      {tier.tagline}
                    </p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="my-6 pb-6 border-b-2 border-black/20 flex items-baseline space-x-1">
                  <span className="text-5xl sm:text-6xl font-black tracking-tighter">
                    ${tier.price}
                  </span>
                  <span className={`text-xs font-black uppercase ${tier.colorText === 'text-white' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    / FULL 3-DAY PASS
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs font-bold leading-snug">
                      <div className="w-4 h-4 rounded-full bg-[#f5ce32] text-black border border-black flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book Button */}
              <button
                onClick={() => handleBookTier(tier)}
                className={`w-full py-4 border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] ${
                  tier.colorText === 'text-white'
                    ? 'bg-[#f5ce32] hover:bg-yellow-400 text-black'
                    : 'bg-black hover:bg-neutral-800 text-white'
                }`}
              >
                <span>Select & Reserve Seat</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Group Discount Calculator */}
      <section className="py-14 px-4 sm:px-8 bg-white border-t-4 border-b-4 border-black">
        <div className="max-w-4xl mx-auto bg-[#fbfbf9] border-3 border-black rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-black mb-6">
            <div>
              <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block mb-1">
                TEAM & CORPORATE PRICING
              </span>
              <h3 className="text-2xl font-black uppercase text-black tracking-tight">
                GROUP PASS DISCOUNT CALCULATOR
              </h3>
              <p className="text-xs font-bold text-neutral-600 mt-0.5">
                Save 10% on 3+ passes, 15% on 5+ passes, and 20% on 10+ passes.
              </p>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center space-x-3 bg-white p-2 border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
              <button
                onClick={() => setGroupCount(Math.max(1, groupCount - 1))}
                className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-black flex items-center justify-center font-black"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-base font-black w-8 text-center">{groupCount}</span>
              <button
                onClick={() => setGroupCount(Math.min(20, groupCount + 1))}
                className="w-8 h-8 rounded-xl bg-[#f5ce32] hover:bg-yellow-400 border border-black flex items-center justify-center font-black"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white border-2 border-black rounded-xl">
              <p className="text-[10px] font-black uppercase text-neutral-500">Selected Tier</p>
              <p className="text-sm font-black text-black mt-0.5">{selectedTierForBooking.name}</p>
            </div>

            <div className="p-4 bg-white border-2 border-black rounded-xl">
              <p className="text-[10px] font-black uppercase text-neutral-500">Group Discount</p>
              <p className="text-sm font-black text-emerald-600 mt-0.5">
                {discountRate > 0 ? `${discountRate * 100}% OFF (-$${discountAmount.toFixed(0)})` : 'None (Add 3+ for 10% off)'}
              </p>
            </div>

            <div className="p-4 bg-[#f5ce32] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000]">
              <p className="text-[10px] font-black uppercase text-neutral-800">Total Price</p>
              <p className="text-2xl font-black text-black leading-tight mt-0.5">
                ${finalTotal.toFixed(0)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleBookTier(selectedTierForBooking)}
              className="px-6 py-3 bg-black hover:bg-neutral-800 text-white border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#f5ce32] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center space-x-2"
            >
              <span>Book {groupCount} Pass{groupCount > 1 ? 'es' : ''} Now</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Feature Comparison Matrix */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="mb-10 text-center">
          <span className="px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase rounded-sm border border-black shadow-[2px_2px_0px_#fff]">
            FULL BREAKDOWN
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black mt-3">
            PASS FEATURE COMPARISON
          </h2>
        </div>

        <div className="bg-white border-3 border-black rounded-3xl overflow-x-auto shadow-[6px_6px_0px_#000]">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-neutral-100 border-b-3 border-black">
                <th className="p-4 sm:p-5 text-xs font-black uppercase tracking-wider text-black w-2/5">
                  Feature / Access Level
                </th>
                <th className="p-4 sm:p-5 text-xs font-black uppercase tracking-wider text-center text-black w-1/5 bg-[#e5d4ff]/40 border-l-2 border-black">
                  Attendee ($99)
                </th>
                <th className="p-4 sm:p-5 text-xs font-black uppercase tracking-wider text-center text-black w-1/5 bg-black text-[#f5ce32] border-l-2 border-black">
                  VIP ($159)
                </th>
                <th className="p-4 sm:p-5 text-xs font-black uppercase tracking-wider text-center text-black w-1/5 bg-[#98d8ef]/40 border-l-2 border-black">
                  Executive ($299)
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-black/15 hover:bg-neutral-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'
                  }`}
                >
                  <td className="p-4 text-xs font-bold text-black">{row.feature}</td>
                  <td className="p-4 text-center border-l-2 border-black/20">
                    {row.attendee ? (
                      <Check className="w-4 h-4 mx-auto text-emerald-600 stroke-[3]" />
                    ) : (
                      <span className="text-neutral-400 font-bold">—</span>
                    )}
                  </td>
                  <td className="p-4 text-center border-l-2 border-black/20 bg-amber-50/40">
                    {row.vip ? (
                      <Check className="w-4 h-4 mx-auto text-black stroke-[3]" />
                    ) : (
                      <span className="text-neutral-400 font-bold">—</span>
                    )}
                  </td>
                  <td className="p-4 text-center border-l-2 border-black/20">
                    {row.exec ? (
                      <Check className="w-4 h-4 mx-auto text-blue-600 stroke-[3]" />
                    ) : (
                      <span className="text-neutral-400 font-bold">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Footer */}
      <ConferioFooter />

      {/* Auth Modal with Gating */}
      <ClerkAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        contextMessage={authContextMessage}
        onSuccess={handleAuthSuccess}
      />

      {/* Interactive Seat Map Modal */}
      <InteractiveSeatMap
        isOpen={isSeatMapOpen}
        onClose={() => setIsSeatMapOpen(false)}
        eventTitle={`EventSphere AI 2026 (${selectedTierForBooking.name})`}
        onConfirmSeats={handleConfirmSeats}
      />

      {/* Razorpay Payment Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        eventTitle={`Event Sphere AI 2026 Summit`}
        tierName={selectedTierForBooking.name}
        price={selectedTierForBooking.price}
        ticketTypeId={selectedTierForBooking.id}
        seatInfo={selectedSeatString}
        onPaymentSuccess={handlePaymentSuccess}
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
          handleBookTier(PASS_TIERS[1]);
        }}
      />
    </div>
  );
}
