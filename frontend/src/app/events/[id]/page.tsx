'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { eventService } from '@/features/events/services/event.service';
import { EventItem } from '@/features/events/types/event.types';
import { ConferioTicker } from '@/features/conferio/components/ConferioTicker';
import { ConferioNavbar } from '@/features/conferio/components/ConferioNavbar';
import { ConferioFooter } from '@/features/conferio/components/ConferioFooter';
import {
  Calendar,
  MapPin,
  Users,
  Globe,
  ArrowLeft,
  CheckCircle,
  Edit,
  Copy,
  Loader2,
  Sparkles,
  Layers,
  ExternalLink,
  Ticket,
  Share2,
  Clock,
  Armchair,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { getCustomEventById } from '@/lib/custom-events';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'passes'>('overview');

  useEffect(() => {
    // 1. Direct local custom event lookup
    const localCustom = getCustomEventById(resolvedParams.id);
    if (localCustom) {
      setEvent({
        id: localCustom.id,
        title: localCustom.title,
        description: localCustom.description || localCustom.tagline,
        category: localCustom.category,
        startDate: localCustom.startDate,
        endDate: localCustom.endDate || localCustom.startDate,
        location: `${localCustom.venue}, ${localCustom.city}`,
        status: localCustom.status,
        capacity: localCustom.capacity,
        currentAttendees: localCustom.attendeesCount,
        isVirtual: localCustom.eventType === 'VIRTUAL',
        coverImageUrl: localCustom.imageUrl,
        ticketTiers: [
          {
            id: `tier-1-${localCustom.id}`,
            name: 'General Admission',
            price: localCustom.price,
            capacity: localCustom.capacity,
            available: localCustom.capacity - localCustom.attendeesCount,
          },
          {
            id: `tier-2-${localCustom.id}`,
            name: 'VIP Pass',
            price: localCustom.vipPrice || localCustom.price * 2,
            capacity: 200,
            available: 180,
          },
        ],
      } as any);
      setLoading(false);
      return;
    }

    eventService
      .getEventById(resolvedParams.id)
      .then((res) => {
        setEvent(res);
        setLoading(false);
      })
      .catch(() => {
        // Fallback event data
        setEvent({
          id: resolvedParams.id,
          title: 'Innovators Connect Live Summit 2026',
          description:
            'The flagship European gathering for AI architects, founders, and engineers. Join 12,000+ delegates at ExCeL London for 48 keynote sessions, zero-latency RAG workshops, and VIP rooftop networking.',
          category: 'CONFERENCE',
          startDate: '2026-01-22T09:00:00Z',
          endDate: '2026-01-24T19:00:00Z',
          location: 'ExCeL London Exhibition Arena, Royal Victoria Dock, London E16 1XL',
          status: 'PUBLISHED',
          capacity: 2500,
          currentAttendees: 2180,
          isVirtual: false,
          coverImageUrl:
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
          ticketTiers: [
            { id: 'tier-1', name: 'Attendee Pass', price: 99, capacity: 1500, available: 320 },
            { id: 'tier-2', name: 'VIP All-Access', price: 159, capacity: 800, available: 60 },
            { id: 'tier-3', name: 'Executive & Investor', price: 299, capacity: 200, available: 15 },
          ],
        } as any);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading || !event) {
    return (
      <div className="min-h-screen bg-[#fbfbf9] flex flex-col items-center justify-center p-6 space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
        <p className="text-xs font-black uppercase tracking-wider text-black">
          Loading Event Studio...
        </p>
      </div>
    );
  }

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
      {/* 1. Ticker */}
      <ConferioTicker />

      {/* 2. Navbar */}
      <ConferioNavbar />

      {/* 3. Hero Header Strip */}
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/events"
              className="inline-flex items-center text-xs font-black uppercase text-black hover:underline underline-offset-4 tracking-wider"
            >
              <ArrowLeft className="w-4 h-4 mr-1 stroke-[3]" />
              <span>Back to All Events</span>
            </Link>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="px-3 py-1.5 bg-white hover:bg-neutral-100 border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-[2px_2px_0px_#000]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <Link
                href="/pricing"
                className="px-4 py-1.5 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#fff]"
              >
                Buy Tickets
              </Link>
            </div>
          </div>

          <div>
            <div className="inline-block px-2.5 py-0.5 bg-black text-[#f5ce32] text-[10px] font-black uppercase tracking-widest rounded-sm mb-2 border border-black">
              ★ {event.category || 'GLOBAL SUMMIT'} · {event.status} ★
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-tight">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      {/* 4. Main Event Showcase Content */}
      <main className="py-10 px-4 sm:px-8 max-w-6xl mx-auto w-full flex-1 space-y-8">
        {/* Cover Photo & Fast Facts Card */}
        <div className="bg-white border-3 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_#000]">
          <div className="relative h-72 sm:h-96 w-full bg-neutral-900 border-b-3 border-black overflow-hidden">
            <img
              src={
                event.bannerUrl ||
                event.coverImageUrl ||
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
              }
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 bg-[#f5ce32] text-black font-black text-xs uppercase rounded border-2 border-black shadow-[2px_2px_0px_#000]">
              CONFIRMED VENUE
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#fbfbf9] text-xs font-bold text-black">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f5ce32] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                <Calendar className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-500 block">Dates</span>
                <span>
                  {new Date(event.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-500 block">Location</span>
                <span className="truncate block">{event.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e5d4ff] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                <Users className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-500 block">Capacity</span>
                <span>
                  {(event.registeredCount ?? event.currentAttendees) || 2180} / {event.capacity || 2500} Attendees
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 border-b-2 border-black pb-3">
          {[
            { id: 'overview', label: 'Summit Overview & Syllabus' },
            { id: 'sessions', label: 'Keynote Tracks & Speakers' },
            { id: 'passes', label: 'Pass Options & Seat Selection' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === t.id
                  ? 'bg-black text-[#f5ce32] shadow-[2px_2px_0px_#f5ce32]'
                  : 'bg-white hover:bg-neutral-100 text-black'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
              <h3 className="text-xl font-black uppercase text-black">About This Summit</h3>
              <p className="text-xs sm:text-sm font-bold text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>

              <div className="pt-4 border-t-2 border-black/10 grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 border-2 border-black rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-neutral-500">FORMAT</span>
                  <p className="text-sm font-black text-black mt-0.5">In-Person Exhibition & Keynote Arena</p>
                </div>
                <div className="p-4 bg-neutral-50 border-2 border-black rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-neutral-500">ACCESSIBILITY</span>
                  <p className="text-sm font-black text-black mt-0.5">Direct Elizabeth Line Connection</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#f5ce32] border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] space-y-4">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-[#f5ce32] rounded">
                  PASS BOOKING
                </span>
                <h4 className="text-xl font-black uppercase text-black leading-tight">
                  Reserve Your Seat for 2026
                </h4>
                <p className="text-xs font-bold text-black/80">
                  Passes include 3-day auditorium admission, lunch, and instant QR badge access.
                </p>
                <Link
                  href="/pricing"
                  className="w-full py-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[2px_2px_0px_#fff]"
                >
                  <span>Select Pass Tier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
            <h3 className="text-xl font-black uppercase text-black mb-4">Confirmed Sessions & Stages</h3>
            <div className="space-y-3">
              {[
                { time: '09:00 AM', title: 'Opening Keynote: Autonomous Agent Swarms', speaker: 'Dr. Aris Vance', hall: 'Hall A' },
                { time: '11:00 AM', title: 'Zero-Latency Streaming at 10M QPS', speaker: 'Maya Lin', hall: 'Stage 2' },
                { time: '02:00 PM', title: 'Vector Database Benchmarking with Qdrant', speaker: 'Elena Rostova', hall: 'Stage 2' },
              ].map((s, idx) => (
                <div key={idx} className="p-4 bg-neutral-50 border-2 border-black rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-black bg-black text-[#f5ce32] px-2 py-0.5 rounded">
                      {s.time}
                    </span>
                    <h4 className="text-sm font-black uppercase text-black mt-1">{s.title}</h4>
                    <p className="text-xs font-bold text-neutral-600">
                      {s.speaker} · <span className="text-black font-black">{s.hall}</span>
                    </p>
                  </div>
                  <Link href="/schedule" className="px-3 py-1 bg-white border border-black rounded-lg text-xs font-bold">
                    View in Timetable
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Passes Tab */}
        {activeTab === 'passes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(event.ticketTiers || []).map((t: any, idx: number) => (
              <div
                key={idx}
                className="bg-white border-3 border-black rounded-3xl p-6 shadow-[5px_5px_0px_#000] flex flex-col justify-between space-y-4"
              >
                <div>
                  <h4 className="text-xl font-black uppercase text-black">{t.name}</h4>
                  <p className="text-3xl font-black text-black mt-2">${t.price}</p>
                  <p className="text-xs font-bold text-neutral-600 mt-1">
                    {t.available || 50} passes remaining
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="w-full py-2.5 bg-black hover:bg-neutral-800 text-[#f5ce32] rounded-xl text-xs font-black uppercase text-center shadow-[2px_2px_0px_#f5ce32]"
                >
                  Book This Tier
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 5. Footer */}
      <ConferioFooter />
    </div>
  );
}
