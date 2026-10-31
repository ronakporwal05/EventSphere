'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConferioTicker } from '@/features/conferio/components/ConferioTicker';
import { ConferioNavbar } from '@/features/conferio/components/ConferioNavbar';
import { ConferioFooter } from '@/features/conferio/components/ConferioFooter';
import { ClerkAuthModal, AuthModalMode } from '@/features/auth/components/ClerkAuthModal';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { hasHierarchyAccess, resolveHierarchyRole } from '@/features/auth/utils/hierarchy';
import { getCustomEvents, deleteCustomEvent, CustomEventItem } from '@/lib/custom-events';
import {
  Users,
  DollarSign,
  Ticket,
  Scan,
  TrendingUp,
  Activity,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Download,
  Bell,
  Sparkles,
  ArrowRight,
  Filter,
  RefreshCw,
  Mail,
  ShieldCheck,
  Lock,
  Crown,
  Briefcase,
  Trash2,
  ExternalLink,
  Copy,
  Calendar,
  MapPin,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';

interface AttendeeRow {
  id: string;
  name: string;
  email: string;
  ticketId: string;
  tier: 'VIP All-Access' | 'Executive' | 'Attendee';
  seat: string;
  checkedIn: boolean;
  checkInTime?: string;
}

const INITIAL_ATTENDEES: AttendeeRow[] = [
  {
    id: 'att-1',
    name: 'Ronak Verma',
    email: 'ronak.innovator@gmail.com',
    ticketId: 'TCK-ES-9842',
    tier: 'VIP All-Access',
    seat: 'A-4',
    checkedIn: true,
    checkInTime: '08:42 AM',
  },
  {
    id: 'att-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@vectorflow.io',
    ticketId: 'TCK-ES-8120',
    tier: 'Executive',
    seat: 'B-1',
    checkedIn: true,
    checkInTime: '08:55 AM',
  },
  {
    id: 'att-3',
    name: 'Marcus Sterling',
    email: 'marcus@apexengine.dev',
    ticketId: 'TCK-ES-7741',
    tier: 'VIP All-Access',
    seat: 'A-5',
    checkedIn: true,
    checkInTime: '09:05 AM',
  },
  {
    id: 'att-4',
    name: 'Siddharth Sen',
    email: 'siddharth@autocoder.ai',
    ticketId: 'TCK-ES-6219',
    tier: 'Attendee',
    seat: 'D-3',
    checkedIn: false,
  },
  {
    id: 'att-5',
    name: 'Chloe Dubois',
    email: 'chloe.dubois@linearstudio.design',
    ticketId: 'TCK-ES-5412',
    tier: 'VIP All-Access',
    seat: 'B-2',
    checkedIn: false,
  },
  {
    id: 'att-6',
    name: 'David Chen',
    email: 'david.chen@apexstages.com',
    ticketId: 'TCK-ES-4390',
    tier: 'Executive',
    seat: 'C-6',
    checkedIn: true,
    checkInTime: '09:18 AM',
  },
  {
    id: 'att-7',
    name: 'Maya Lin',
    email: 'maya.lin@cloudscale.net',
    ticketId: 'TCK-ES-3329',
    tier: 'Attendee',
    seat: 'D-4',
    checkedIn: false,
  },
  {
    id: 'att-8',
    name: 'Tariq Al-Mansoor',
    email: 'tariq@fortifyai.security',
    ticketId: 'TCK-ES-2198',
    tier: 'Executive',
    seat: 'C-7',
    checkedIn: true,
    checkInTime: '09:30 AM',
  },
];

export default function OrganizerDashboardPage() {
  const { user, isAuthenticated, loginAsRole } = useAuthStore();
  const canAccess = isAuthenticated && hasHierarchyAccess(user?.role, 'EVENT_MANAGER');

  const [attendees, setAttendees] = useState<AttendeeRow[]>(INITIAL_ATTENDEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'VIP All-Access' | 'Executive' | 'Attendee'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CHECKED_IN' | 'PENDING'>('ALL');

  // Hosted custom events
  const [customEvents, setCustomEvents] = useState<CustomEventItem[]>([]);

  useEffect(() => {
    setCustomEvents(getCustomEvents());

    const handleSync = () => {
      setCustomEvents(getCustomEvents());
    };
    window.addEventListener('eventsphere_events_updated', handleSync);
    return () => window.removeEventListener('eventsphere_events_updated', handleSync);
  }, []);

  const handleDeleteCustomEvent = (id: string, eventTitle: string) => {
    if (confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      const remaining = deleteCustomEvent(id);
      setCustomEvents(remaining);
      toast.success(`Event "${eventTitle}" deleted.`);
    }
  };

  const handleCopyEventLink = (id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/events/${id}`;
      navigator.clipboard?.writeText(url);
      toast.success('Public Event link copied to clipboard!');
    }
  };

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('SIGN_IN');

  if (!canAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
        <ConferioTicker />
        <ConferioNavbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border-4 border-black rounded-3xl p-8 sm:p-10 shadow-[8px_8px_0px_#000] text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-amber-100 border-2 border-black rounded-2xl flex items-center justify-center text-amber-700 shadow-[3px_3px_0px_#000]">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <span className="px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase rounded-sm border border-black shadow-[2px_2px_0px_#fff]">
                LEVEL 2 HIERARCHY RESTRICTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-3">
                EVENT MANAGER POWER REQUIRED
              </h2>
              <p className="text-xs sm:text-sm font-bold text-neutral-600 mt-2">
                The Organizer Cockpit is restricted to verified Event Managers and Admins. Current role:{' '}
                <span className="font-mono text-amber-700 uppercase">
                  {user ? resolveHierarchyRole(user.role) : 'UNAUTHENTICATED GUEST'}
                </span>
                .
              </p>
            </div>
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2.5">
              <span className="text-[10px] font-black uppercase text-amber-900 block">
                ⚡ 1-Click Elevate Hierarchy Role:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    loginAsRole('EVENT_MANAGER');
                    toast.success('Elevated session to 🏢 Event Manager!');
                  }}
                  className="py-2.5 px-3 bg-indigo-700 hover:bg-indigo-800 text-white border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] flex items-center justify-center space-x-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-200" />
                  <span>Event Manager</span>
                </button>
                <button
                  onClick={() => {
                    loginAsRole('ADMIN');
                    toast.success('Elevated session to 👑 Supreme Admin!');
                  }}
                  className="py-2.5 px-3 bg-purple-700 hover:bg-purple-800 text-white border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] flex items-center justify-center space-x-1.5"
                >
                  <Crown className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Admin</span>
                </button>
              </div>
            </div>
            <Link
              href="/portal"
              className="inline-block text-xs font-black uppercase underline hover:text-indigo-700"
            >
              Go to Attendee Pass Wallet Instead
            </Link>
          </div>
        </main>
        <ConferioFooter />
      </div>
    );
  }

  // Toggle check-in state for an attendee
  const handleToggleCheckIn = (id: string) => {
    setAttendees((prev) =>
      prev.map((att) => {
        if (att.id === id) {
          const newStatus = !att.checkedIn;
          const time = newStatus
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : undefined;
          toast.success(
            newStatus
              ? `Turnstile Check-In Confirmed for ${att.name} (${att.ticketId})`
              : `Check-in reverted for ${att.name}`
          );
          return { ...att, checkedIn: newStatus, checkInTime: time };
        }
        return att;
      })
    );
  };

  // Filtered attendees list
  const filteredAttendees = attendees.filter((att) => {
    if (tierFilter !== 'ALL' && att.tier !== tierFilter) return false;
    if (statusFilter === 'CHECKED_IN' && !att.checkedIn) return false;
    if (statusFilter === 'PENDING' && att.checkedIn) return false;
    if (
      searchQuery &&
      !att.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !att.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !att.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const checkedInCount = attendees.filter((a) => a.checkedIn).length;
  const totalCount = attendees.length;
  const checkInRate = Math.round((checkedInCount / totalCount) * 100);

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = [
      'Ticket ID,Name,Email,Tier,Seat,Checked In,Time',
      ...attendees.map(
        (a) => `${a.ticketId},"${a.name}",${a.email},${a.tier},${a.seat},${a.checkedIn ? 'YES' : 'NO'},${a.checkInTime || 'N/A'}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `eventsphere-attendees-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendee roster exported as CSV!');
  };

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

      {/* 3. Hero Header Section */}
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm mb-3 border border-black shadow-[2px_2px_0px_#fff]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#f5ce32]" />
              <span>ORGANIZER COCKPIT // EVENT SPHERE AI 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              COMMAND CENTER & CHECK-IN
            </h1>

            <p className="text-xs sm:text-sm font-bold text-black/80 mt-2">
              Real-time ticket revenue, turnstile gate check-in rates, and predictive AI arrival forecasts.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link
              href="/events/create"
              className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Event</span>
            </Link>

            <Link
              href="/scanner"
              className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center space-x-1.5"
            >
              <Scan className="w-4 h-4 text-emerald-600" />
              <span>Turnstile Scanner</span>
            </Link>

            <Link
              href="/ai-studio"
              className="px-4 py-2.5 bg-[#e5d4ff] hover:bg-purple-200 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>AI Studio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Live Brutalist KPI Cards */}
      <section className="py-10 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Revenue */}
          <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Total Ticket Revenue
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#f5ce32] border border-black flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
            </div>
            <p className="text-3xl font-black text-black tracking-tight leading-tight">$48,920.00</p>
            <div className="flex items-center space-x-1.5 text-[11px] font-black text-emerald-600 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.8% vs Yesterday</span>
            </div>
          </div>

          {/* Card 2: Registered */}
          <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Registered Attendees
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 border border-black flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-700 stroke-[2.5]" />
              </div>
            </div>
            <p className="text-3xl font-black text-black tracking-tight leading-tight">1,420 / 1,500</p>
            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden border border-black mt-3">
              <div className="bg-blue-600 h-full" style={{ width: '94.6%' }} />
            </div>
          </div>

          {/* Card 3: Live Gate Check-ins */}
          <div className="bg-black text-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#f5ce32] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                Live Turnstile Check-ins
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#f5ce32] text-black border border-black flex items-center justify-center">
                <Scan className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#f5ce32] tracking-tight leading-tight">
              {checkedInCount} / {totalCount} ({checkInRate}%)
            </p>
            <p className="text-[11px] font-bold text-neutral-300 mt-2">
              Gate turnstiles active on Level 1
            </p>
          </div>

          {/* Card 4: AI Predicted Rate */}
          <div className="bg-[#e5d4ff] border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800">
                AI Predicted Final Turnout
              </span>
              <div className="w-8 h-8 rounded-xl bg-black text-[#f5ce32] border border-black flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#f5ce32]" />
              </div>
            </div>
            <p className="text-3xl font-black text-black tracking-tight leading-tight">96.4%</p>
            <p className="text-[11px] font-black text-purple-900 mt-2">
              Confidence Index: ±1.2% (Qdrant model)
            </p>
          </div>
        </div>
      </section>

      {/* 4.5. Hosted Events & Summits (Organizer Cockpit) */}
      <section id="my-events" className="py-6 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block">
                  ORGANIZER PORTFOLIO
                </span>
                <span className="text-xs font-black text-neutral-500 font-mono">
                  {customEvents.length} {customEvents.length === 1 ? 'SUMMIT' : 'SUMMITS'} PUBLISHED
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-black tracking-tight mt-1">
                YOUR HOSTED EVENTS & SUMMITS
              </h2>
              <p className="text-xs text-neutral-600 font-medium">
                Manage your live summits, view attendee registrations, copy public ticket links, and launch turnstiles.
              </p>
            </div>

            <Link
              href="/events/create"
              className="px-4 py-2.5 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center space-x-1.5 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Another Event</span>
            </Link>
          </div>

          {customEvents.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-neutral-300 rounded-2xl text-center space-y-3 bg-neutral-50">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 border-2 border-black flex items-center justify-center text-amber-700">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black uppercase text-black">No Custom Events Yet</h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto">
                You haven&apos;t created any summits yet. Launch your first event with AI-generated copy and dynamic ticketing in under 60 seconds.
              </p>
              <Link
                href="/events/create"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-black text-[#f5ce32] border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#000]"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Create Your First Event</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#fbfbf9] border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_#000] flex flex-col hover:-translate-y-0.5 transition-all"
                >
                  {/* Image & Badges */}
                  <div className="relative h-44 w-full border-b-2 border-black overflow-hidden bg-neutral-900">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-black text-[#f5ce32] text-[10px] font-black uppercase rounded border border-black shadow-[1px_1px_0px_#fff]">
                        {event.category}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-400 text-black text-[10px] font-black uppercase rounded border border-black shadow-[1px_1px_0px_#000] flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                        <span>LIVE SUMMIT</span>
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-white border-2 border-black rounded-lg px-2 py-1 text-center shadow-[2px_2px_0px_#000]">
                      <span className="block text-[10px] font-black uppercase text-neutral-500 leading-none">
                        {event.monthBadge}
                      </span>
                      <span className="block text-base font-black text-black leading-none mt-0.5">
                        {event.dayBadge}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-base font-black uppercase text-black tracking-tight line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-2 mt-1 font-medium">
                        {event.tagline}
                      </p>

                      <div className="mt-3 space-y-1.5 text-xs text-neutral-700 font-bold">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span className="truncate">{event.venue}, {event.city}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">{event.startDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="pt-3 border-t-2 border-black/10 space-y-3">
                      <div className="flex items-center justify-between text-xs font-black">
                        <span className="text-emerald-700">
                          {event.price === 0 ? 'FREE ENTRY' : `₹${event.price.toLocaleString()} General`}
                        </span>
                        <span className="text-neutral-500 font-mono text-[11px]">
                          Cap: {event.capacity} seats
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/events/${event.id}`}
                          className="px-2.5 py-1.5 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-lg font-black text-[11px] uppercase tracking-wider flex items-center justify-center space-x-1 shadow-[2px_2px_0px_#000]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Page</span>
                        </Link>
                        <button
                          onClick={() => handleCopyEventLink(event.id)}
                          className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-lg font-black text-[11px] uppercase tracking-wider flex items-center justify-center space-x-1 shadow-[2px_2px_0px_#000]"
                        >
                          <Copy className="w-3 h-3 text-neutral-600" />
                          <span>Copy Link</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <Link
                          href="/scanner"
                          className="text-[11px] font-black uppercase text-indigo-700 hover:underline flex items-center space-x-1"
                        >
                          <Scan className="w-3 h-3" />
                          <span>Gate Turnstiles</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteCustomEvent(event.id, event.title)}
                          className="text-[11px] font-black uppercase text-rose-600 hover:underline flex items-center space-x-1"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Attendee Roster & Gate Check-In Manager */}
      <section className="py-6 px-4 sm:px-8 max-w-6xl mx-auto w-full flex-1">
        <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-black">
            <div>
              <span className="px-2.5 py-0.5 bg-[#f5ce32] text-black text-[10px] font-black uppercase rounded border border-black inline-block mb-1">
                ATTENDEE ROSTER
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-black tracking-tight">
                GATE CHECK-IN & PASS DISPATCH
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 border-2 border-black rounded-xl text-xs font-black uppercase flex items-center space-x-1.5 shadow-[2px_2px_0px_#000]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => toast.success('Broadcast push notification sent to all checked-in attendees!')}
                className="px-3.5 py-2 bg-black hover:bg-neutral-800 text-white border-2 border-black rounded-xl text-xs font-black uppercase flex items-center space-x-1.5 shadow-[2px_2px_0px_#f5ce32]"
              >
                <Bell className="w-3.5 h-3.5 text-[#f5ce32]" />
                <span>Broadcast Alert</span>
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attendee by name, email, or ticket ID..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black placeholder-neutral-500 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_#000]"
              >
                <option value="ALL">All Statuses</option>
                <option value="CHECKED_IN">Checked In Only</option>
                <option value="PENDING">Pending Check-in</option>
              </select>

              {/* Tier filter */}
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value as any)}
                className="px-3 py-2 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_#000]"
              >
                <option value="ALL">All Pass Tiers</option>
                <option value="VIP All-Access">VIP All-Access</option>
                <option value="Executive">Executive</option>
                <option value="Attendee">Attendee</option>
              </select>
            </div>
          </div>

          {/* Attendees Table */}
          <div className="border-2 border-black rounded-2xl overflow-x-auto shadow-[3px_3px_0px_#000]">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-neutral-100 border-b-2 border-black text-[11px] font-black uppercase text-black">
                  <th className="p-3.5">Ticket ID</th>
                  <th className="p-3.5">Attendee Name</th>
                  <th className="p-3.5">Pass Tier</th>
                  <th className="p-3.5">Seat</th>
                  <th className="p-3.5">Check-In Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map((att) => (
                  <tr
                    key={att.id}
                    className="border-b border-black/10 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="p-3.5 font-mono text-xs font-black text-black">
                      {att.ticketId}
                    </td>

                    <td className="p-3.5">
                      <p className="text-xs font-black text-black leading-tight">{att.name}</p>
                      <p className="text-[10px] text-neutral-500 font-bold">{att.email}</p>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase border border-black ${
                          att.tier === 'VIP All-Access'
                            ? 'bg-black text-[#f5ce32]'
                            : att.tier === 'Executive'
                            ? 'bg-[#98d8ef] text-black'
                            : 'bg-[#e5d4ff] text-black'
                        }`}
                      >
                        {att.tier}
                      </span>
                    </td>

                    <td className="p-3.5 font-bold text-xs text-black">
                      {att.seat}
                    </td>

                    <td className="p-3.5">
                      {att.checkedIn ? (
                        <div className="flex items-center space-x-1.5 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          <span className="text-xs font-black uppercase">
                            Checked In ({att.checkInTime})
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-neutral-400">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black" />
                          <span className="text-xs font-black uppercase text-neutral-500">
                            Awaiting Arrival
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleCheckIn(att.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-black uppercase border border-black transition-all shadow-[1px_1px_0px_#000] ${
                            att.checkedIn
                              ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                              : 'bg-emerald-400 hover:bg-emerald-500 text-black'
                          }`}
                        >
                          {att.checkedIn ? 'Revert' : 'Check In'}
                        </button>

                        <button
                          onClick={() => toast.success(`Resent QR pass link to ${att.email}`)}
                          title="Resend QR Pass"
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 border border-black rounded-lg text-black transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
}
