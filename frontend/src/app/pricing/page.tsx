'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  CreditCard,
  Zap,
  Building,
  Ticket,
  Plus,
  Minus,
  Crown,
  Briefcase,
  HelpCircle,
  QrCode,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

// ==========================================
// 1. ATTENDEE EVENT PASS TIERS (ONE-TIME TICKETS)
// ==========================================
export interface PassTier {
  id: string;
  name: string;
  tagline: string;
  price: number; // in INR ₹
  badge?: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
  shadowColor: string;
  features: string[];
}

const ATTENDEE_PASS_TIERS: PassTier[] = [
  {
    id: 'tier-std-01',
    name: 'Standard Attendee Pass',
    tagline: 'Full 3-Day Summit Admission & Keynote Arena',
    price: 999,
    badge: 'EARLY BIRD',
    colorBg: 'bg-[#ede9fe]',
    colorText: 'text-black',
    colorBorder: 'border-black',
    shadowColor: '#000',
    features: [
      'Access to All 48 Keynotes & Expo Floor',
      'General Admission Seating in Main Hall',
      'Exhibition & Developer Showcase Booths',
      'Official Event Sphere AI Swag Kit',
      'Complimentary Lunch & Coffee Vouchers',
      'Digital Verified Attendance Certificate',
    ],
  },
  {
    id: 'tier-vip-02',
    name: 'Pro All-Access Pass',
    tagline: 'Priority Reserved Seating & Hands-on AI Workshops',
    price: 1999,
    badge: 'MOST POPULAR // ★★★★★',
    colorBg: 'bg-black',
    colorText: 'text-white',
    colorBorder: 'border-black',
    shadowColor: '#f5ce32',
    features: [
      'Everything in Standard Attendee Pass, plus:',
      'Priority Row Reserved Mainstage Seating',
      'Access to All Hands-on ML & Systems Workshops',
      'Fast-Track Turnstile QR Gate Entry',
      'Speaker Lounge & Founders Fireside Entry',
      'Curated Gourmet Lunch & Evening Cocktails',
      'All Recorded Session Replays (4K Ultra HD)',
    ],
  },
  {
    id: 'tier-exec-03',
    name: 'VIP Executive Pass',
    tagline: '1-on-1 Investor Access, Front Recliners & Gala Dinner',
    price: 4999,
    badge: 'EXCLUSIVE // LIMITED TO 150',
    colorBg: 'bg-[#e0f2fe]',
    colorText: 'text-black',
    colorBorder: 'border-black',
    shadowColor: '#000',
    features: [
      'Everything in Pro All-Access Pass, plus:',
      'Front-Row Reserved Keynote Recliner',
      'Private 1-on-1 Investor Matchmaking Slot',
      'Executive Boardroom Lunch & Networking Gala',
      'Dedicated Chauffeur Airport Pickup/Drop',
      'Permanent Video Vault & Transcript Access',
      'Custom Commemorative Metal QR Badge',
    ],
  },
];

// ==========================================
// 2. ORGANIZER HOSTING SUBSCRIPTIONS (SAAS PLANS)
// ==========================================
export interface OrganizerPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number; // in INR ₹
  annualPrice: number; // in INR ₹ per month
  badge?: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
  shadowColor: string;
  features: string[];
  highlight?: boolean;
}

const ORGANIZER_PLANS: OrganizerPlan[] = [
  {
    id: 'sub-starter-01',
    name: 'Starter Host',
    tagline: 'For community meetup organizers and solo creators',
    monthlyPrice: 0,
    annualPrice: 0,
    badge: 'FREE FOREVER',
    colorBg: 'bg-white',
    colorText: 'text-black',
    colorBorder: 'border-black',
    shadowColor: '#000',
    features: [
      'Host up to 100 Attendees per summit',
      '5% Platform fee on paid ticket sales',
      'Turnstile Web QR Check-in Scanner',
      'Real-time Attendee Roster & CSV Export',
      'Automated Ticket Email Dispatches',
      'Community Help & Knowledge Base',
    ],
  },
  {
    id: 'sub-pro-02',
    name: 'Pro Organizer',
    tagline: 'Power suite for conferences, summits & hackathons',
    monthlyPrice: 2499,
    annualPrice: 1999, // ₹1,999/mo billed annually @ ₹23,988/yr
    badge: 'MOST POPULAR FOR ORGANIZERS',
    colorBg: 'bg-black',
    colorText: 'text-white',
    colorBorder: 'border-black',
    shadowColor: '#f5ce32',
    highlight: true,
    features: [
      'Host up to 5,000 Attendees per summit',
      'Low 2% Platform Fee on paid tickets',
      'Unlimited Gemini 1.5 AI Copilot copy generator',
      'Interactive Auditorium Seat Map Designer',
      'Real-time Turnstile Gate Analytics & Surge Alerts',
      'Custom Organization Branding, Logos & Colors',
      'Broadcast Push Notifications to All Attendees',
    ],
  },
  {
    id: 'sub-enterprise-03',
    name: 'Enterprise Agency',
    tagline: 'Multi-tenant white-label suite for event agencies & venues',
    monthlyPrice: 7999,
    annualPrice: 6399, // ₹6,399/mo billed annually @ ₹76,788/yr
    badge: '0% PLATFORM FEE',
    colorBg: 'bg-[#e5d4ff]',
    colorText: 'text-black',
    colorBorder: 'border-black',
    shadowColor: '#000',
    features: [
      'Unlimited Attendees & Unlimited Summits',
      '0% Platform Fee (Keep 100% of ticket sales)',
      'Dedicated Multi-Tenant Database Schema & SLA',
      'White-Label Portal & Custom Subdomain',
      'VIP Fast-Track Turnstile Sync & Multi-Gate Support',
      'Unlimited Vector AI Tokens & RAG Knowledge Search',
      'Dedicated 24/7 Account Manager & Priority Phone SLA',
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();

  // Mode Switcher: ATTENDEE (Buy Event Tickets) vs ORGANIZER (Platform Subscriptions)
  const [activeTab, setActiveTab] = useState<'ATTENDEE' | 'ORGANIZER'>('ATTENDEE');

  // Organizer billing cycle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Attendee group pass counter
  const [groupCount, setGroupCount] = useState<number>(1);
  const [selectedTierForBooking, setSelectedTierForBooking] = useState<PassTier>(ATTENDEE_PASS_TIERS[1]);

  // Selected booking variables for accurate payment calculations
  const [bookingQuantity, setBookingQuantity] = useState<number>(1);
  const [bookingUnitPrice, setBookingUnitPrice] = useState<number>(1999);
  const [bookingTotalPrice, setBookingTotalPrice] = useState<number>(1999);
  const [isSubscriptionCheckout, setIsSubscriptionCheckout] = useState<boolean>(false);
  const [subPlanName, setSubPlanName] = useState<string>('Pro Organizer');

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

  // Check URL query parameters for ?tab=organizer on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam?.toLowerCase() === 'organizer' || tabParam?.toLowerCase() === 'subscription') {
        setActiveTab('ORGANIZER');
      }
    }
  }, []);

  // Gated action executor
  const executeWithAuth = (action: () => void, contextMsg?: string) => {
    if (useAuthStore.getState().isAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setAuthContextMessage(contextMsg || 'Please sign in with Google to continue.');
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

  // ----------------------------------------------------
  // ATTENDEE TICKET BOOKING FLOW
  // ----------------------------------------------------
  const handleBookAttendeeTier = (tier: PassTier) => {
    executeWithAuth(() => {
      setSelectedTierForBooking(tier);
      setBookingUnitPrice(tier.price);
      setBookingQuantity(1);
      setBookingTotalPrice(tier.price);
      setIsSubscriptionCheckout(false);
      setIsSeatMapOpen(true);
    }, `Sign in with Google to select your seat for ${tier.name}.`);
  };

  // Seat selection confirmed -> Transition to payment modal with exact calculations
  const handleConfirmSeats = (seats: SelectedSeat[]) => {
    setIsSeatMapOpen(false);
    if (seats.length > 0) {
      const seatNames = seats.map((s) => s.id).join(', ');
      const seatCount = seats.length;
      const totalAmount = seats.reduce((acc, s) => acc + s.price, 0);

      setSelectedSeatString(seatNames);
      setBookingQuantity(seatCount);
      setBookingTotalPrice(totalAmount);
      setBookingUnitPrice(Math.round(totalAmount / seatCount));
      setIsSubscriptionCheckout(false);
      setIsPaymentModalOpen(true);
      toast.success(`Selected ${seatCount} seat(s): ${seatNames} (Total: ₹${totalAmount.toLocaleString('en-IN')}). Loading payment gateway...`);
    } else {
      setSelectedSeatString(undefined);
      setBookingQuantity(1);
      setBookingTotalPrice(selectedTierForBooking.price);
      setBookingUnitPrice(selectedTierForBooking.price);
      setIsSubscriptionCheckout(false);
      setIsPaymentModalOpen(true);
    }
  };

  // Group Discount Booking
  const discountRate = groupCount >= 10 ? 0.2 : groupCount >= 5 ? 0.15 : groupCount >= 3 ? 0.1 : 0;
  const groupUnitPrice = selectedTierForBooking.price;
  const groupSubtotal = groupUnitPrice * groupCount;
  const groupDiscount = Math.round(groupSubtotal * discountRate);
  const groupFinalTotal = groupSubtotal - groupDiscount;

  const handleBookGroupPasses = () => {
    executeWithAuth(() => {
      setBookingQuantity(groupCount);
      setBookingUnitPrice(groupUnitPrice);
      setBookingTotalPrice(groupFinalTotal);
      setSelectedSeatString(undefined);
      setIsSubscriptionCheckout(false);
      setIsPaymentModalOpen(true);
      toast.success(`Reserving ${groupCount} passes for ${selectedTierForBooking.name} (Total: ₹${groupFinalTotal.toLocaleString('en-IN')}).`);
    }, `Sign in to purchase ${groupCount} group passes.`);
  };

  // ----------------------------------------------------
  // ORGANIZER SUBSCRIPTION FLOW
  // ----------------------------------------------------
  const handleSubscribeOrganizer = (plan: OrganizerPlan) => {
    if (plan.monthlyPrice === 0) {
      // Free starter plan
      useAuthStore.getState().loginAsRole('EVENT_MANAGER');
      toast.success('Starter Organizer plan activated! Redirecting to event creation...');
      router.push('/events/create');
      return;
    }

    executeWithAuth(() => {
      const planCost = billingCycle === 'annual' ? plan.annualPrice * 12 : plan.monthlyPrice;
      setSubPlanName(plan.name);
      setBookingTotalPrice(planCost);
      setBookingUnitPrice(planCost);
      setBookingQuantity(1);
      setIsSubscriptionCheckout(true);
      setIsPaymentModalOpen(true);
      toast.info(`Preparing checkout for ${plan.name} (${billingCycle === 'annual' ? 'Billed Annually' : 'Billed Monthly'})...`);
    }, `Sign in to activate your ${plan.name} subscription.`);
  };

  // Payment success handler -> Adds pass to wallet or upgrades role
  const handlePaymentSuccess = (data?: any) => {
    setIsPaymentModalOpen(false);

    if (isSubscriptionCheckout) {
      toast.success(`🎉 Congratulations! You are now subscribed to ${subPlanName}. Organizer features unlocked!`);
      router.push('/manage');
      return;
    }

    // Attendee ticket pass generation
    const newPass: ConfirmedPass = {
      id: `pass-${Date.now()}`,
      ticketNumber: data?.ticketNumber || data?.ticketId || `TCK-IND-${Math.floor(1000 + Math.random() * 9000)}`,
      eventTitle: `Event Sphere AI 2026 (${selectedTierForBooking.name})`,
      date: 'JAN 22-24, 2026',
      location: 'KTPO Trade Center, Whitefield, Bengaluru',
      tier: selectedTierForBooking.name,
      seat: selectedSeatString || `General Entry (${bookingQuantity} pass${bookingQuantity > 1 ? 'es' : ''})`,
      price: bookingTotalPrice,
      status: 'CONFIRMED',
    };
    setMyTickets((prev) => [newPass, ...prev]);
    toast.success(`Pass confirmed! Official QR Ticket Pass generated for ${bookingQuantity} attendee(s).`);
    setIsTicketsModalOpen(true);
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
          setActiveTab('ATTENDEE');
          handleBookAttendeeTier(ATTENDEE_PASS_TIERS[1]);
        }}
        onOpenAuth={(mode, context) => {
          setAuthModalMode(mode);
          setAuthContextMessage(context);
          setIsAuthModalOpen(true);
        }}
        likedCount={likedEventIds.size}
        ticketCount={myTickets.length}
      />

      {/* 3. Hero Header Section with Dual-Mode Switcher */}
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-14 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm border border-black shadow-[2px_2px_0px_#fff]">
            <Sparkles className="w-3.5 h-3.5 text-[#f5ce32]" />
            <span>TRANSPARENT VALUE // NO HIDDEN FEES</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">
                {activeTab === 'ATTENDEE' ? (
                  <>
                    ATTENDEE PASSES & <br />
                    <span className="underline decoration-black decoration-wavy decoration-2">
                      EVENT TICKETS
                    </span>
                  </>
                ) : (
                  <>
                    ORGANIZER HOSTING & <br />
                    <span className="underline decoration-black decoration-wavy decoration-2">
                      SAAS SUBSCRIPTIONS
                    </span>
                  </>
                )}
              </h1>
              <p className="max-w-2xl text-sm sm:text-base font-bold text-black/80 mt-3">
                {activeTab === 'ATTENDEE'
                  ? 'Attendees purchase one-time event tickets and seat passes with zero recurring subscription fees. Full 3-day access, instant QR badges, and gourmet catering.'
                  : 'Event Organizers subscribe to host unlimited summits, deploy AI turnstile scanners, generate promotional copy with Gemini, and manage multi-tenant payouts.'}
              </p>
            </div>

            {/* HIGH-CONTRAST DUAL-MODE TAB SWITCHER */}
            <div className="bg-black p-2 rounded-2xl border-3 border-black shadow-[5px_5px_0px_#fff] flex items-center space-x-2 self-start lg:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('ATTENDEE')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                  activeTab === 'ATTENDEE'
                    ? 'bg-[#f5ce32] text-black shadow-[2px_2px_0px_#fff]'
                    : 'text-white hover:text-[#f5ce32]'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>Attendee Passes</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ORGANIZER')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                  activeTab === 'ORGANIZER'
                    ? 'bg-[#f5ce32] text-black shadow-[2px_2px_0px_#fff]'
                    : 'text-white hover:text-[#f5ce32]'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Organizer Plans</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. VIEW A: ATTENDEE PASSES (BUY TICKETS)                */}
      {/* ======================================================== */}
      {activeTab === 'ATTENDEE' && (
        <>
          <section className="py-14 px-4 sm:px-8 max-w-6xl mx-auto w-full">
            <div className="mb-8 flex items-center justify-between pb-3 border-b-2 border-black">
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">
                  ONE-TIME TICKET PURCHASE
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-black tracking-tight">
                  SELECT YOUR SUMMIT PASS
                </h2>
              </div>
              <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-400">
                ● 100% ONE-TIME • NO SUBSCRIPTION
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ATTENDEE_PASS_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative ${tier.colorBg} ${tier.colorText} border-4 ${tier.colorBorder} rounded-3xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}
                >
                  {/* Badge */}
                  {tier.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#f5ce32] text-black text-[10px] font-black uppercase tracking-wider rounded-full border-2 border-black shadow-[2px_2px_0px_#000]">
                      {tier.badge}
                    </div>
                  )}

                  <div>
                    <div className="mb-4">
                      <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">
                        {tier.name}
                      </h3>
                      <p className={`text-xs font-bold mt-1 ${tier.colorText === 'text-white' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {tier.tagline}
                      </p>
                    </div>

                    {/* Price in ₹ INR */}
                    <div className="my-6 pb-6 border-b-2 border-black/20 flex items-baseline space-x-1.5">
                      <span className="text-5xl sm:text-6xl font-black tracking-tighter">
                        ₹{tier.price.toLocaleString('en-IN')}
                      </span>
                      <span className={`text-xs font-black uppercase ${tier.colorText === 'text-white' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        / SINGLE PASS
                      </span>
                    </div>

                    {/* Features */}
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
                    onClick={() => handleBookAttendeeTier(tier)}
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

          {/* Group Pass Discount Calculator */}
          <section className="py-14 px-4 sm:px-8 bg-white border-t-4 border-b-4 border-black">
            <div className="max-w-4xl mx-auto bg-[#fbfbf9] border-3 border-black rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#000]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-black mb-6">
                <div>
                  <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block mb-1">
                    TEAM & CORPORATE TICKETING
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
                  <p className="text-base font-black text-black mt-1">{selectedTierForBooking.name}</p>
                  <p className="text-xs font-bold text-neutral-600">₹{selectedTierForBooking.price.toLocaleString('en-IN')} / pass</p>
                </div>

                <div className="p-4 bg-white border-2 border-black rounded-xl">
                  <p className="text-[10px] font-black uppercase text-neutral-500">Group Discount Rate</p>
                  <p className="text-base font-black text-emerald-600 mt-1">
                    {discountRate > 0 ? `${discountRate * 100}% Discount` : 'No Discount (Min 3)'}
                  </p>
                  <p className="text-xs font-bold text-neutral-600">
                    {discountRate > 0 ? `Saved ₹${groupDiscount.toLocaleString('en-IN')}` : 'Add more tickets for savings'}
                  </p>
                </div>

                <div className="p-4 bg-[#f5ce32] border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
                  <p className="text-[10px] font-black uppercase text-black">Net Total Payable</p>
                  <p className="text-2xl font-black text-black mt-1 font-mono">
                    ₹{groupFinalTotal.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] font-bold text-black/70">For {groupCount} attendee(s)</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-2 border-black/10 flex justify-end">
                <button
                  onClick={handleBookGroupPasses}
                  className="px-6 py-3 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#f5ce32] flex items-center space-x-2"
                >
                  <span>Book {groupCount} Passes (₹{groupFinalTotal.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ======================================================== */}
      {/* 5. VIEW B: ORGANIZER SUBSCRIPTIONS (SAAS PLANS)          */}
      {/* ======================================================== */}
      {activeTab === 'ORGANIZER' && (
        <section className="py-14 px-4 sm:px-8 max-w-6xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-black mb-10">
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">
                FOR EVENT HOSTS, MANAGERS & ORGANIZERS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                ORGANIZER PLATFORM SUBSCRIPTIONS
              </h2>
              <p className="text-xs text-neutral-600 font-bold mt-1">
                Choose the SaaS plan that powers your attendance, AI marketing copy, and multi-tenant ticket payouts.
              </p>
            </div>

            {/* Monthly vs Annual Toggle */}
            <div className="flex items-center space-x-2 bg-neutral-100 p-1.5 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000]">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-black text-[#f5ce32] shadow-[1px_1px_0px_#fff]'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-black text-xs uppercase transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-[#f5ce32] text-black shadow-[1px_1px_0px_#000]'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <span>Annual</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500 text-white rounded font-mono">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ORGANIZER_PLANS.map((plan) => {
              const currentPrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
              const isFree = currentPrice === 0;

              return (
                <div
                  key={plan.id}
                  className={`relative ${plan.colorBg} ${plan.colorText} border-4 ${plan.colorBorder} rounded-3xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#f5ce32] text-black text-[10px] font-black uppercase tracking-wider rounded-full border-2 border-black shadow-[2px_2px_0px_#000]">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <div className="mb-4">
                      <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">
                        {plan.name}
                      </h3>
                      <p className={`text-xs font-bold mt-1 ${plan.colorText === 'text-white' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Price in ₹ INR */}
                    <div className="my-6 pb-6 border-b-2 border-black/20 flex items-baseline space-x-1.5">
                      <span className="text-5xl sm:text-6xl font-black tracking-tighter">
                        {isFree ? '₹0' : `₹${currentPrice.toLocaleString('en-IN')}`}
                      </span>
                      <span className={`text-xs font-black uppercase ${plan.colorText === 'text-white' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {isFree ? '/ FREE HOSTING' : billingCycle === 'annual' ? '/ MONTH (BILLED ANNUALLY)' : '/ MONTH'}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 text-xs font-bold leading-snug">
                          <div className="w-4 h-4 rounded-full bg-[#f5ce32] text-black border border-black flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subscribe / Start Button */}
                  <button
                    onClick={() => handleSubscribeOrganizer(plan)}
                    className={`w-full py-4 border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] ${
                      plan.highlight
                        ? 'bg-[#f5ce32] hover:bg-yellow-400 text-black'
                        : plan.colorText === 'text-white'
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                        : 'bg-black hover:bg-neutral-800 text-white'
                    }`}
                  >
                    <span>{isFree ? 'Start Free as Organizer' : `Subscribe to ${plan.name}`}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

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

      {/* Interactive Seat Map Modal (for Attendee Passes) */}
      <InteractiveSeatMap
        isOpen={isSeatMapOpen}
        onClose={() => setIsSeatMapOpen(false)}
        eventTitle={`EventSphere AI 2026 (${selectedTierForBooking.name})`}
        basePrice={selectedTierForBooking.price}
        tierName={selectedTierForBooking.name}
        onConfirmSeats={handleConfirmSeats}
      />

      {/* Razorpay Payment Modal with Accurate Math */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        eventTitle={isSubscriptionCheckout ? 'EventSphere AI Multi-Tenant SaaS' : 'Event Sphere AI 2026 Summit'}
        tierName={isSubscriptionCheckout ? subPlanName : selectedTierForBooking.name}
        price={bookingTotalPrice}
        unitPrice={bookingUnitPrice}
        quantity={bookingQuantity}
        ticketTypeId={isSubscriptionCheckout ? 'sub-organizer-plan' : selectedTierForBooking.id}
        seatInfo={selectedSeatString}
        isOrganizerSubscription={isSubscriptionCheckout}
        billingCycle={billingCycle}
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
          setActiveTab('ATTENDEE');
          handleBookAttendeeTier(ATTENDEE_PASS_TIERS[1]);
        }}
      />
    </div>
  );
}
