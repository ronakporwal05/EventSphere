'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ConferioTicker } from '@/features/conferio/components/ConferioTicker';
import { ConferioNavbar } from '@/features/conferio/components/ConferioNavbar';
import { ConferioFooter } from '@/features/conferio/components/ConferioFooter';
import { PaymentGatewayModal } from '@/features/tickets/components/PaymentGatewayModal';
import { InteractiveSeatMap, SelectedSeat } from '@/features/tickets/components/InteractiveSeatMap';
import {
  Sparkles,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Download,
  Star,
  Search,
  Users,
  MessageSquare,
  Armchair,
  DoorOpen,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

type PortalTab = 'wallet' | 'passes' | 'agenda' | 'networking';

interface PassRecord {
  id: string;
  ticketNumber: string;
  eventTitle: string;
  date: string;
  location: string;
  tier: string;
  seat: string;
  price: number;
  status: 'CONFIRMED' | 'ATTENDED';
}

const INITIAL_PORTAL_PASSES: PassRecord[] = [
  {
    id: 'pass-01',
    ticketNumber: 'TCK-ES-9842',
    eventTitle: 'Innovators Connect Live Summit 2026',
    date: 'JAN 22 - 24, 2026',
    location: 'ExCeL London Arena, UK',
    tier: 'VIP All-Access',
    seat: 'A-4 (Reserved Front Row)',
    price: 1999,
    status: 'CONFIRMED',
  },
  {
    id: 'pass-02',
    ticketNumber: 'TCK-ES-8120',
    eventTitle: 'Autonomous AI & Vector Compute Conclave',
    date: 'FEB 15 - 16, 2026',
    location: 'Whitefield Tech Center, Bengaluru',
    tier: 'Executive Delegate',
    seat: 'B-1 (Main Hall)',
    price: 999,
    status: 'CONFIRMED',
  },
];

export default function PublicPortalPage() {
  const [activeTab, setActiveTab] = useState<PortalTab>('wallet');
  const [passes, setPasses] = useState<PassRecord[]>(INITIAL_PORTAL_PASSES);

  // Booking states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [selectedSeatString, setSelectedSeatString] = useState<string | undefined>('A-12');
  const [selectedTier, setSelectedTier] = useState({ id: 'tier-vip-01', name: 'VIP All-Access', price: 1999 });
  const [bookingTotalPrice, setBookingTotalPrice] = useState<number>(1999);
  const [bookingQuantity, setBookingQuantity] = useState<number>(1);

  // Networking search
  const [networkSearch, setNetworkSearch] = useState('');

  // Handle seat map confirmation
  const handleConfirmSeats = (seats: SelectedSeat[]) => {
    setIsSeatMapOpen(false);
    if (seats.length > 0) {
      const seatNames = seats.map((s) => s.id || `${s.row}-${s.number}`).join(', ');
      const totalAmount = seats.reduce((acc, s) => acc + s.price, 0);
      setSelectedSeatString(seatNames);
      setBookingQuantity(seats.length);
      setBookingTotalPrice(totalAmount);
      setIsBookingOpen(true);
      toast.success(`Selected ${seats.length} seat(s): ${seatNames} (Total: ₹${totalAmount.toLocaleString('en-IN')}). Loading payment...`);
    } else {
      setSelectedSeatString(undefined);
      setBookingQuantity(1);
      setBookingTotalPrice(selectedTier.price);
      setIsBookingOpen(true);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = (ticketData?: any) => {
    setIsBookingOpen(false);
    const newPass: PassRecord = {
      id: `pass-${Date.now()}`,
      ticketNumber: ticketData?.ticketId || `TCK-ES-${Math.floor(1000 + Math.random() * 9000)}`,
      eventTitle: 'Innovators Connect Live 2026',
      date: 'JAN 22 - 24, 2026',
      location: 'ExCeL London Arena, UK',
      tier: selectedSeatString ? `${selectedTier.name} (${bookingQuantity} Pass${bookingQuantity > 1 ? 'es' : ''})` : selectedTier.name,
      seat: selectedSeatString || 'General Hall',
      price: bookingTotalPrice,
      status: 'CONFIRMED',
    };
    setPasses((prev) => [newPass, ...prev]);
    setActiveTab('wallet');
    toast.success('Pass issued! Added to your Digital Pass Wallet.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
      {/* 1. Ticker */}
      <ConferioTicker />

      {/* 2. Navbar */}
      <ConferioNavbar />

      {/* 3. Hero Header Section */}
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm mb-3 border border-black shadow-[2px_2px_0px_#fff]">
              <Ticket className="w-3.5 h-3.5 text-[#f5ce32]" />
              <span>ATTENDEE PORTAL & DELEGATE WALLET</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              DELEGATE PORTAL & WALLET
            </h1>

            <p className="text-xs sm:text-sm font-bold text-black/80 mt-2">
              Access your digital QR passes, interact with live stage agendas, book reserved seats, and connect with attendees.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link
              href="/pricing?tab=attendee"
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#fff]"
            >
              Get More Passes
            </Link>
            <Link
              href="/schedule"
              className="px-4 py-2 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000]"
            >
              Full Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Tab Navigation Strip */}
      <section className="bg-white border-b-4 border-black py-4 px-4 sm:px-8 sticky top-16 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2.5">
          {[
            { id: 'wallet', label: `My QR Passes (${passes.length})`, icon: QrCode },
            { id: 'passes', label: 'Book Summit Passes', icon: Ticket },
            { id: 'agenda', label: 'Interactive Agenda', icon: Calendar },
            { id: 'networking', label: 'Summit Networking Hub', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PortalTab)}
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

      {/* 5. Tab Content Container */}
      <main className="py-10 px-4 sm:px-8 max-w-6xl mx-auto w-full flex-1">
        {/* TAB 1: PASSES WALLET */}
        {activeTab === 'wallet' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <span className="text-xs font-black uppercase tracking-wider text-black">
                Your Confirmed Digital Passes ({passes.length})
              </span>
              <span className="text-xs font-bold text-neutral-600">
                Show at turnstile optical scanner at Gate 1 or 2
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {passes.map((pass) => (
                <div
                  key={pass.id}
                  className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block mb-1">
                          {pass.tier}
                        </span>
                        <h3 className="text-xl font-black uppercase tracking-tight text-black leading-tight">
                          {pass.eventTitle}
                        </h3>
                      </div>
                      <span className="text-xs font-mono font-black px-2 py-0.5 bg-black text-white rounded">
                        {pass.status}
                      </span>
                    </div>

                    {/* QR Code and Meta Box */}
                    <div className="p-4 bg-neutral-50 border-2 border-black rounded-2xl flex items-center space-x-5">
                      {/* Stylized QR Code Graphic */}
                      <div className="w-24 h-24 bg-white border-2 border-black rounded-xl p-2 flex flex-col items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                        <QrCode className="w-16 h-16 text-black" />
                        <span className="text-[8px] font-mono font-black text-neutral-600 truncate mt-0.5">
                          {pass.ticketNumber}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-bold text-black flex-1">
                        <p className="flex items-center space-x-1.5 text-neutral-600">
                          <Clock className="w-3.5 h-3.5 text-black" />
                          <span>{pass.date}</span>
                        </p>
                        <p className="flex items-center space-x-1.5 text-neutral-600">
                          <MapPin className="w-3.5 h-3.5 text-black" />
                          <span className="truncate">{pass.location}</span>
                        </p>
                        <p className="flex items-center space-x-1.5 text-black font-black pt-1">
                          <Armchair className="w-3.5 h-3.5 text-[#f5ce32]" />
                          <span>Seat: {pass.seat}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={() => toast.success(`Downloading PDF pass for ${pass.ticketNumber}...`)}
                      className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#f5ce32] flex items-center justify-center space-x-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>

                    <Link
                      href="/scanner"
                      className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] flex items-center space-x-1.5"
                    >
                      <DoorOpen className="w-3.5 h-3.5" />
                      <span>Test Scan</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BOOK PASSES */}
        {activeTab === 'passes' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'tier-gen-02', name: 'Attendee Pass', price: 999, bg: 'bg-[#e5d4ff]', desc: 'Standard 3-Day Summit Admission' },
                { id: 'tier-vip-01', name: 'VIP All-Access', price: 1999, bg: 'bg-black text-white', desc: 'Premier Reserved Front Seating' },
                { id: 'tier-dev-vip', name: 'Executive & Investor', price: 4999, bg: 'bg-[#98d8ef]', desc: '1-on-1 Speaker Office Hours' },
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className={`border-3 border-black rounded-3xl p-6 ${tier.bg} shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4`}
                >
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">
                      {tier.name}
                    </h3>
                    <p className="text-xs font-bold mt-1 opacity-80">{tier.desc}</p>
                    <p className="text-4xl font-black mt-4">₹{tier.price.toLocaleString('en-IN')}</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTier({ id: tier.id, name: tier.name, price: tier.price });
                      setBookingTotalPrice(tier.price);
                      setBookingQuantity(1);
                      setIsSeatMapOpen(true);
                    }}
                    className="w-full py-3 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] flex items-center justify-center space-x-1.5"
                  >
                    <span>Select Seat & Book</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AGENDA */}
        {activeTab === 'agenda' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <span className="text-xs font-black uppercase tracking-wider text-black">
                Official 3-Day Timetable
              </span>
              <Link href="/schedule" className="text-xs font-black text-blue-600 underline">
                View Expanded Schedule Page →
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { time: '09:00 AM - 10:15 AM', title: 'Opening Keynote: Autonomous Swarms', speaker: 'Dr. Aris Vance', hall: 'Hall A' },
                { time: '10:45 AM - 12:00 PM', title: 'Zero-Latency Streaming at 10M QPS', speaker: 'Maya Lin', hall: 'Stage 2' },
                { time: '01:30 PM - 03:00 PM', title: 'Hands-on Workshop: Qdrant Embeddings', speaker: 'Kavita Chawla', hall: 'Lab B' },
                { time: '05:30 PM - 07:30 PM', title: 'Rooftop VIP Opening Soiree', speaker: 'Event Sphere AI Hosts', hall: 'Level 5' },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border-2 border-black rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[3px_3px_0px_#000]"
                >
                  <div>
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-black text-[#f5ce32] rounded">
                      {s.time}
                    </span>
                    <h4 className="text-sm font-black uppercase text-black mt-1">{s.title}</h4>
                    <p className="text-xs font-bold text-neutral-600">
                      Presented by {s.speaker} · <span className="font-black text-black">{s.hall}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => toast.success(`Bookmarked session "${s.title}"`)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-black rounded-lg text-xs font-bold shrink-0"
                  >
                    + Add to My Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: NETWORKING */}
        {activeTab === 'networking' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b-2 border-black">
              <span className="text-xs font-black uppercase tracking-wider text-black">
                Delegates & Founders Directory (12,000+ Registered)
              </span>
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={networkSearch}
                  onChange={(e) => setNetworkSearch(e.target.value)}
                  placeholder="Search by name, company, stack..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border-2 border-black rounded-xl text-xs font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Ronak Verma', role: 'Architect & Founder', org: 'Innovate AI', badge: 'VIP' },
                { name: 'Elena Rostova', role: 'VP Engineering', org: 'VectorFlow', badge: 'Speaker' },
                { name: 'Marcus Sterling', role: 'Founder & CEO', org: 'Apex Engine', badge: 'Speaker' },
                { name: 'Maya Lin', role: 'Principal Architect', org: 'CloudScale', badge: 'Speaker' },
                { name: 'Chloe Dubois', role: 'VP Design', org: 'Linear Studio', badge: 'Executive' },
                { name: 'Tariq Al-Mansoor', role: 'CSO', org: 'Fortify AI', badge: 'Speaker' },
              ].map((user, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white border-3 border-black rounded-3xl shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#f5ce32] text-black rounded border border-black">
                        {user.badge}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">Day 1 & 2</span>
                    </div>
                    <h4 className="text-base font-black uppercase text-black mt-2 leading-tight">
                      {user.name}
                    </h4>
                    <p className="text-xs font-bold text-neutral-600">
                      {user.role} · <span className="font-black text-black">{user.org}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => toast.success(`Intro request sent to ${user.name}!`)}
                    className="w-full py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#f5ce32]"
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 6. Footer */}
      <ConferioFooter />

      {/* Interactive Seat Map Modal */}
      <InteractiveSeatMap
        isOpen={isSeatMapOpen}
        onClose={() => setIsSeatMapOpen(false)}
        eventTitle="Event Sphere AI 2026 Summit"
        basePrice={selectedTier.price}
        onConfirmSeats={handleConfirmSeats}
      />

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        eventTitle="Event Sphere AI 2026 Summit"
        tierName={selectedTier.name}
        price={bookingTotalPrice}
        unitPrice={selectedTier.price}
        quantity={bookingQuantity}
        ticketTypeId={selectedTier.id}
        seatInfo={selectedSeatString}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
