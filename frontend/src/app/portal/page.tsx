'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Flame,
  Search,
  Users,
  Smartphone,
  Share2,
  FileText,
  Building2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { PaymentGatewayModal } from '@/features/tickets/components/PaymentGatewayModal';
import { InteractiveSeatMap, SelectedSeat } from '@/features/tickets/components/InteractiveSeatMap';
import { EventAgenda } from '@/features/events/components/EventAgenda';
import { SummitNetworkingDirectory } from '@/features/community/components/SummitNetworkingDirectory';
import { DualFeedbackModal } from '@/features/feedback/components/DualFeedbackModal';
import { toast } from 'sonner';

export default function PublicPortalPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'agenda' | 'networking' | 'passes'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  // Booking & Seat Map modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [selectedSeatInfo, setSelectedSeatInfo] = useState<string | undefined>(undefined);

  const [selectedEvent, setSelectedEvent] = useState<{ id: string; title: string }>({
    id: 'evt-global-2026',
    title: 'Bengaluru GenAI Summit & Founders Meet 2026',
  });

  const [selectedTier, setSelectedTier] = useState<{ id: string; name: string; price: number }>({
    id: 'tier-vip-01',
    name: 'General Delegate Pass',
    price: 1499,
  });

  // Dual feedback state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Indian Cities filter
  const INDIAN_CITIES = ['All Cities', 'Bengaluru', 'Mumbai', 'Delhi-NCR', 'Hyderabad', 'Pune'];

  // Registered Passes Wallet with INR
  const [myTickets, setMyTickets] = useState([
    {
      id: 'pass-01',
      ticketNumber: 'TCK-BLR-VIP-9001',
      eventTitle: 'Bengaluru GenAI Summit & Founders Meet 2026',
      date: 'Sat, 24 Oct 2026 • 09:30 AM IST',
      location: 'Koramangala Indoor Arena, Bengaluru',
      tier: 'Diamond VIP Access',
      seat: 'Row B - Seat 7',
      price: 3499,
      status: 'ISSUED',
      companyName: 'Acme Corp India Pvt Ltd',
      gstin: '29AABCU9603R1ZM',
      canReview: false,
    },
    {
      id: 'pass-02',
      ticketNumber: 'TCK-MUM-8821',
      eventTitle: 'Mumbai Cloud & Microservices Summit',
      date: 'Sun, 12 Oct 2026 • 10:00 AM IST',
      location: 'Jio World Convention Centre, BKC, Mumbai',
      tier: 'Developer Pass',
      seat: 'General Floor Entry',
      price: 1999,
      status: 'ATTENDED',
      companyName: 'Individual',
      gstin: undefined,
      canReview: true,
    },
  ]);

  // Handle standard tier booking click
  const handleBookClick = (evt: { id: string; title: string }, tier: { id?: string; name: string; price: number }) => {
    setSelectedEvent(evt);
    setSelectedTier({
      id: tier.id || 'tier-vip-01',
      name: tier.name,
      price: tier.price,
    });
    setSelectedSeatInfo(undefined);
    setIsBookingOpen(true);
    toast.success(`10-minute Redis seat lock held for ${tier.name}!`);
  };

  // Handle interactive seat selection from BookMyShow-style stage map
  const handleOpenSeatMap = (evt: { id: string; title: string }) => {
    setSelectedEvent(evt);
    setIsSeatMapOpen(true);
  };

  const handleConfirmSeats = (seats: SelectedSeat[]) => {
    setIsSeatMapOpen(false);
    const seatNames = seats.map((s) => s.id).join(', ');
    const totalSeatPrice = seats.reduce((acc, s) => acc + s.price, 0);

    setSelectedTier({
      id: 'tier-vip-01',
      name: `${seats[0].tier} (${seats.length} Seat${seats.length > 1 ? 's' : ''})`,
      price: totalSeatPrice,
    });
    setSelectedSeatInfo(`Seats: ${seatNames}`);
    setIsBookingOpen(true);
    toast.success(`Reserved Seats [${seatNames}] with 10-minute Redis lock!`);
  };

  // Payment Success Handler
  const handlePaymentSuccess = (ticketData?: any) => {
    setIsBookingOpen(false);
    const newPass = {
      id: ticketData?.id || `pass-${Date.now()}`,
      ticketNumber: ticketData?.ticketNumber || `TCK-BLR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      eventTitle: ticketData?.eventTitle || selectedEvent.title,
      date: 'Sat, 24 Oct 2026 • 09:30 AM IST',
      location: selectedEvent.id === 'evt-devcon-2026' ? 'Jio World Convention Centre, Mumbai' : 'Koramangala Indoor Arena, Bengaluru',
      tier: ticketData?.ticketTypeName || selectedTier.name,
      seat: ticketData?.seatInfo || selectedSeatInfo || 'Confirmed Entry',
      price: ticketData?.ticketPrice || selectedTier.price,
      companyName: ticketData?.companyName,
      gstin: ticketData?.gstin,
      status: 'ISSUED',
      canReview: false,
    };
    setMyTickets((prev) => [newPass, ...prev]);
    setActiveTab('passes');
  };

  // 1. WhatsApp Pass Dispatch
  const sendTicketToWhatsApp = (pass: any) => {
    const text = encodeURIComponent(
      `🎟️ *EventSphere AI Entry Pass* 🎟️\n\n` +
      `*Event:* ${pass.eventTitle}\n` +
      `*Pass ID:* ${pass.ticketNumber}\n` +
      `*Seat / Tier:* ${pass.tier} (${pass.seat || 'General'})\n` +
      `*Date & Time:* ${pass.date}\n` +
      `*Venue:* ${pass.location}\n\n` +
      `Show your QR token at entrance turnstiles: http://localhost:3000/portal`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    toast.success(`Dispatched pass ${pass.ticketNumber} to WhatsApp!`);
  };

  // 2. Apple Wallet .pkpass Download
  const downloadAppleWalletPass = (pass: any) => {
    const passData = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.com.eventsphere.conference',
      serialNumber: pass.ticketNumber,
      teamIdentifier: 'IND2026',
      organizationName: 'EventSphere AI',
      description: pass.eventTitle,
      barcode: {
        format: 'PKBarcodeFormatQR',
        message: pass.ticketNumber,
        messageEncoding: 'iso-8859-1',
      },
      relevantDate: '2026-10-24T09:30:00+05:30',
      backgroundColor: 'rgb(249, 115, 22)',
      foregroundColor: 'rgb(255, 255, 255)',
      labelColor: 'rgb(254, 215, 170)',
    };
    const blob = new Blob([JSON.stringify(passData, null, 2)], { type: 'application/vnd.apple.pkpass' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pass.ticketNumber}.pkpass`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Generated Apple Wallet .pkpass for ${pass.ticketNumber}!`);
  };

  // 3. Save to Google Wallet
  const saveToGoogleWallet = (pass: any) => {
    const googleWalletUrl = `https://pay.google.com/gp/v/save/eyJ0eXBlIjoiZXZlbnRUaWNrZXQiLCJpZCI6IiR7cGFzcy50aWNrZXROdW1iZXJ9In0=`;
    window.open(googleWalletUrl, '_blank');
    toast.success(`Synced ${pass.ticketNumber} to Google Wallet!`);
  };

  // 4. Download Corporate B2B GST Tax Invoice
  const downloadGstInvoice = (pass: any) => {
    const base = Math.round(pass.price / 1.18);
    const cgst = Math.round((pass.price - base) / 2);
    const sgst = pass.price - base - cgst;

    const invoiceWindow = window.open('', '_blank');
    if (invoiceWindow) {
      invoiceWindow.document.write(`
        <html>
          <head>
            <title>Tax Invoice - ${pass.ticketNumber}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; }
              .header { border-bottom: 2px solid #ea580c; padding-bottom: 20px; display: flex; justify-content: space-between; }
              .badge { background: #ffedd5; color: #c2410c; padding: 4px 8px; border-radius: 6px; font-weight: bold; }
              table { width: 100%; border-collapse: collapse; margin-top: 30px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background: #f8fafc; font-size: 12px; text-transform: uppercase; }
              .total { font-weight: bold; font-size: 16px; color: #0f172a; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h2>EventSphere Technologies India Pvt Ltd</h2>
                <p>Koramangala 4th Block, Bengaluru, Karnataka - 560034<br/>GSTIN: 29AAACE1234F1Z9 • SAC Code: 998596</p>
              </div>
              <div style="text-align: right;">
                <span class="badge">ORIGINAL TAX INVOICE</span>
                <p><strong>Invoice No:</strong> INV-2026-${pass.ticketNumber}<br/><strong>Date:</strong> 24 Oct 2026</p>
              </div>
            </div>

            <div style="margin-top: 20px;">
              <p><strong>Billed To:</strong> ${pass.companyName || 'Registered Attendee'}<br/>
              <strong>Recipient GSTIN:</strong> ${pass.gstin || 'Unregistered / B2C'}<br/>
              <strong>Place of Supply:</strong> Karnataka (29)</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description of Service</th>
                  <th>SAC Code</th>
                  <th>Seat / Pass</th>
                  <th>Taxable Base (₹)</th>
                  <th>CGST (9%)</th>
                  <th>SGST (9%)</th>
                  <th>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${pass.eventTitle} (${pass.tier})</td>
                  <td>998596</td>
                  <td>${pass.seat || 'Entry'}</td>
                  <td>₹${base}</td>
                  <td>₹${cgst}</td>
                  <td>₹${sgst}</td>
                  <td>₹${pass.price}</td>
                </tr>
                <tr class="total">
                  <td colspan="6" style="text-align: right;">Total Amount Payable:</td>
                  <td>₹${pass.price}</td>
                </tr>
              </tbody>
            </table>

            <p style="margin-top: 40px; font-size: 11px; color: #64748b;">
              * Computer-generated official tax invoice compliant with Section 31 of CGST Act, 2017. Input Tax Credit is admissible to registered persons.
            </p>
          </body>
        </html>
      `);
      invoiceWindow.document.close();
      invoiceWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* ── Top Indian Theme Navbar ── */}
      <header className="h-16 px-4 sm:px-6 bg-neutral-900/90 border-b border-amber-500/20 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-white tracking-tight leading-none">EventSphere</span>
              <span className="px-1.5 py-0.2 text-[8px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded uppercase">
                भारत Edition 2.0
              </span>
            </div>
            <span className="text-[10px] text-amber-400 font-semibold tracking-wide hidden sm:inline">
              BookMyShow & Luma Supercharged Platform
            </span>
          </div>
        </div>

        {/* 4 Main Tabs: Summits | Agenda | Community | Passes */}
        <div className="flex items-center p-1 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'events' ? 'bg-amber-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            📅 Summits
          </button>
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'agenda' ? 'bg-amber-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            🗓️ Multi-Track Agenda
          </button>
          <button
            onClick={() => setActiveTab('networking')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'networking' ? 'bg-purple-500 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            🤝 AI Networking
          </button>
          <button
            onClick={() => setActiveTab('passes')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'passes' ? 'bg-emerald-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>🎟️ My Passes</span>
            <span className="w-4 h-4 rounded-full bg-neutral-900 text-emerald-300 text-[10px] flex items-center justify-center font-bold">
              {myTickets.length}
            </span>
          </button>
        </div>

        <Link
          href="/login"
          className="hidden lg:inline-flex px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 rounded-xl text-xs font-semibold transition-colors"
        >
          Switch Role
        </Link>
      </header>

      {/* ── Main Body Content ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Tab 1: Summits & Tickets */}
        {activeTab === 'events' && (
          <>
            {/* Hero Banner */}
            <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-br from-orange-950/60 via-neutral-900 to-amber-950/40 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-2 max-w-xl z-10">
                <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[11px] font-bold text-orange-400 uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> BookMyShow & District Vibes
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Flagship Indian Tech Summits & High-Concurrency Conferences
                </h1>
                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                  Book passes with our 10-minute Redis seat lock, choose your row on the interactive stage map, apply promo coupons, and checkout via Razorpay & BharatPay UPI!
                </p>
              </div>

              {/* City Filter Pills */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-950/90 border border-neutral-800 rounded-2xl z-10">
                {INDIAN_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      selectedCity === city
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-neutral-950 font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Event Card 1 - Bengaluru */}
              <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-500 transition-all shadow-xl group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg uppercase">
                      GenAI & Cloud • Hybrid
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-amber-400" /> Fast Selling
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    Bengaluru GenAI Summit & Founders Meet 2026
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    Autonomous AI agents, vector indexing on Qdrant, and multi-tenant cloud telemetry with Indian founders.
                  </p>

                  <div className="pt-2 border-t border-neutral-800 space-y-1 text-[11px] text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Sat, 24 Oct 2026 • 09:30 AM IST</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>Koramangala Indoor Arena, Bengaluru</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">Starts at</span>
                    <span className="text-base font-bold font-mono text-emerald-400">₹1,499</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenSeatMap({
                          id: 'evt-global-2026',
                          title: 'Bengaluru GenAI Summit & Founders Meet 2026',
                        })
                      }
                      className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold rounded-2xl text-xs flex items-center gap-1 transition-all"
                      title="Choose Rows & Stage Orientation"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Seat Map</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleBookClick(
                          { id: 'evt-global-2026', title: 'Bengaluru GenAI Summit & Founders Meet 2026' },
                          { id: 'tier-vip-01', name: 'General Delegate Pass', price: 1499 }
                        )
                      }
                      className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-neutral-950 font-extrabold rounded-2xl text-xs inline-flex items-center gap-1 shadow-lg shadow-orange-500/20 transition-all"
                    >
                      <span>Book Pass</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Event Card 2 - Mumbai */}
              <div className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 rounded-3xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-xl group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg uppercase">
                      Engineering • In-Person
                    </span>
                    <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full">
                      VIP Open
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    Mumbai Cloud & Microservices Summit
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    High-concurrency distributed banking architecture, Kafka event streaming, and Kubernetes multi-cloud.
                  </p>

                  <div className="pt-2 border-t border-neutral-800 space-y-1 text-[11px] text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Sun, 12 Oct 2026 • 10:00 AM IST</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>Jio World Convention Centre, BKC, Mumbai</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">Starts at</span>
                    <span className="text-base font-bold font-mono text-emerald-400">₹1,999</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenSeatMap({
                          id: 'evt-devcon-2026',
                          title: 'Mumbai Cloud & Microservices Summit',
                        })
                      }
                      className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold rounded-2xl text-xs flex items-center gap-1 transition-all"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Seat Map</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleBookClick(
                          { id: 'evt-devcon-2026', title: 'Mumbai Cloud & Microservices Summit' },
                          { id: 'tier-dev-01', name: 'Developer Pass', price: 1999 }
                        )
                      }
                      className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-neutral-950 font-extrabold rounded-2xl text-xs inline-flex items-center gap-1 shadow-lg shadow-orange-500/20 transition-all"
                    >
                      <span>Book Pass</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Event Card 3 - Hyderabad */}
              <div className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 rounded-3xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-xl group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg uppercase">
                      Hackathon • ₹10 Lakhs Prize
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Free Entry
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    Hyderabad AI Hackathon & Pitch Arena
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    36-hour code sprint for AI agents and multi-tenant applications using Gemini 1.5 Flash and Qdrant.
                  </p>

                  <div className="pt-2 border-t border-neutral-800 space-y-1 text-[11px] text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Nov 28 - 29, 2026 • 09:00 AM IST</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>T-Hub Innovation Campus, Hyderabad</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">Registration</span>
                    <span className="text-base font-bold font-mono text-emerald-400">FREE</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleBookClick(
                        { id: 'evt-hackathon-2026', title: 'Hyderabad AI Hackathon & Pitch Arena' },
                        { id: 'tier-hack-free', name: 'Hacker Pass', price: 0 }
                      )
                    }
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-neutral-950 font-extrabold rounded-2xl text-xs inline-flex items-center gap-1.5 shadow-lg shadow-orange-500/20 transition-all"
                  >
                    <span>RSVP Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Multi-Track Agenda */}
        {activeTab === 'agenda' && <EventAgenda />}

        {/* Tab 3: AI Networking Directory */}
        {activeTab === 'networking' && <SummitNetworkingDirectory />}

        {/* Tab 4: Passes Wallet with WhatsApp, Apple Wallet, Google Wallet & GST Invoices */}
        {activeTab === 'passes' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-400" />
                  <span>My Passes & Verified Entry Wallet</span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Turnstile scannable QR passes with WhatsApp dispatch, Apple/Google Wallet integration, and GST tax invoices.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">{myTickets.length} Passes Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTickets.map((pass) => (
                <div
                  key={pass.id}
                  className="bg-neutral-900 border border-amber-500/30 rounded-3xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg uppercase">
                          {pass.tier}
                        </span>
                        {pass.seat && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[9px] font-mono font-bold">
                            {pass.seat}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">{pass.eventTitle}</h3>
                      <p className="text-[11px] text-amber-300/80 font-medium">{pass.date}</p>
                      <p className="text-[11px] text-neutral-400">{pass.location}</p>

                      {pass.companyName && (
                        <p className="text-[10px] text-neutral-500 font-mono">
                          Billed to: {pass.companyName} {pass.gstin ? `(${pass.gstin})` : ''}
                        </p>
                      )}
                    </div>

                    {/* QR Code Pass */}
                    <div className="p-2.5 bg-white rounded-2xl text-neutral-950 shrink-0 flex flex-col items-center shadow-lg">
                      <QrCode className="w-12 h-12" />
                      <span className="text-[8px] font-mono font-bold mt-0.5">{pass.ticketNumber}</span>
                    </div>
                  </div>

                  {/* Wallet Action Buttons */}
                  <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => sendTicketToWhatsApp(pass)}
                        className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all"
                        title="Send ticket pass and Google Maps link to your WhatsApp"
                      >
                        <Share2 className="w-3 h-3 text-emerald-400" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadAppleWalletPass(pass)}
                        className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="Add to Apple Wallet (.pkpass)"
                      >
                        <span>🍏 Apple Wallet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => saveToGoogleWallet(pass)}
                        className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="Save to Google Wallet on Android"
                      >
                        <span>🌐 Google Wallet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadGstInvoice(pass)}
                        className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="Print or Download Indian B2B GST Tax Invoice"
                      >
                        <FileText className="w-3 h-3 text-amber-400" />
                        <span>GST Invoice</span>
                      </button>
                    </div>

                    {pass.canReview && (
                      <button
                        type="button"
                        onClick={() => setIsFeedbackOpen(true)}
                        className="px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>Review</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Interactive Visual Seat Map Modal */}
      <InteractiveSeatMap
        isOpen={isSeatMapOpen}
        onClose={() => setIsSeatMapOpen(false)}
        eventTitle={selectedEvent.title}
        onConfirmSeats={handleConfirmSeats}
      />

      {/* Payment Gateway Modal with Coupons, GST, Split Bill & Razorpay */}
      <PaymentGatewayModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        eventTitle={selectedEvent.title}
        tierName={selectedTier.name}
        price={selectedTier.price}
        ticketTypeId={selectedTier.id}
        seatInfo={selectedSeatInfo}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Dual Feedback Modal */}
      <DualFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        eventTitle="Mumbai Cloud & Microservices Summit"
        eventId="evt-mumbai-2026"
      />
    </div>
  );
}
