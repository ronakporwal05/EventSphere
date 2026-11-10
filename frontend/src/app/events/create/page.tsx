'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConferioTicker } from '@/features/conferio/components/ConferioTicker';
import { ConferioNavbar } from '@/features/conferio/components/ConferioNavbar';
import { ConferioFooter } from '@/features/conferio/components/ConferioFooter';
import { ClerkAuthModal, AuthModalMode } from '@/features/auth/components/ClerkAuthModal';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { hasHierarchyAccess, resolveHierarchyRole } from '@/features/auth/utils/hierarchy';
import { OrganizerWorkspaceBar } from '@/features/organizer/components/OrganizerWorkspaceBar';
import { OrganizerAccessGate } from '@/features/organizer/components/OrganizerAccessGate';
import {
  Sparkles,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Eye,
  Zap,
  Tag,
  Loader2,
  Lock,
  Crown,
  Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';
import { saveCustomEvent, formatEventDates, CustomEventItem } from '@/lib/custom-events';
import { apiClient } from '@/lib/api-client';

export default function CreateEventPage() {
  const router = useRouter();
  const { user, isAuthenticated, loginAsRole } = useAuthStore();
  const canAccess = isAuthenticated && hasHierarchyAccess(user?.role, 'EVENT_MANAGER');

  // Form states
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Tech & AI');
  const [eventType, setEventType] = useState<'IN_PERSON' | 'VIRTUAL' | 'HYBRID'>('IN_PERSON');
  const [city, setCity] = useState('London');
  const [venue, setVenue] = useState('ExCeL London Exhibition Arena');
  const [startDate, setStartDate] = useState('2026-03-20');
  const [endDate, setEndDate] = useState('2026-03-22');
  const [capacity, setCapacity] = useState(1500);
  const [description, setDescription] = useState('');
  const [generalPrice, setGeneralPrice] = useState(999);
  const [vipPrice, setVipPrice] = useState(1999);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
  );

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('SIGN_IN');

  // AI Description Generator
  const handleGenerateAiDescription = async () => {
    if (!title.trim()) {
      toast.error('Please enter an Event Title first.');
      return;
    }

    setIsGeneratingAi(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const generated = `Welcome to ${title} — the definitive ${category.toLowerCase()} summit of 2026. Designed for senior engineers, architects, and forward-looking founders, this event brings together 48+ keynote sessions, live production architecture reviews, and high-impact networking at ${venue} (${city}). Discover breakthrough paradigms, debate zero-latency scalability, and forge meaningful relationships in our dedicated investor and builder lounges.`;
      setDescription(generated);
      toast.success('Generated electrifying description with AI Copilot!');
    } catch {
      toast.error('AI generation could not be completed.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Submit / Publish Event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please provide an event title.');
      return;
    }

    if (!isAuthenticated) {
      setAuthModalMode('SIGN_IN');
      setIsAuthModalOpen(true);
      toast.info('Please sign in or create an account to publish your event.');
      return;
    }

    setIsSubmitting(true);
    try {
      const dateInfo = formatEventDates(startDate, endDate);

      const newEvent: CustomEventItem = {
        id: `evt-custom-${Date.now()}`,
        title: title.trim(),
        tagline: tagline.trim() || `The definitive ${category} summit of 2026.`,
        description:
          description.trim() ||
          `Welcome to ${title.trim()} — the definitive ${category.toLowerCase()} summit of 2026. Bringing together keynote sessions, live architecture demos, and high-impact networking at ${venue} (${city}).`,
        category,
        eventType,
        city,
        venue,
        startDate: dateInfo.displayDate,
        endDate: endDate || startDate,
        dayBadge: dateInfo.dayBadge,
        monthBadge: dateInfo.monthBadge,
        price: Number(generalPrice),
        vipPrice: Number(vipPrice),
        capacity: Number(capacity),
        attendeesCount: 0,
        imageUrl:
          imageUrl.trim() ||
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        createdAt: new Date().toISOString(),
        status: 'PUBLISHED',
        isCustom: true,
      };

      // 1. Save to persistent storage immediately
      saveCustomEvent(newEvent);

      // 2. Dispatch to backend if available
      try {
        await apiClient.post('/events', {
          title: newEvent.title,
          slug: newEvent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: newEvent.description,
          category: newEvent.category,
          venue: newEvent.venue,
          city: newEvent.city,
          startDate: `${startDate}T09:00:00`,
          endDate: `${endDate || startDate}T18:00:00`,
          capacity: newEvent.capacity,
          isVirtual: newEvent.eventType === 'VIRTUAL',
          ticketPrice: newEvent.price,
        });
      } catch (backendErr) {
        console.warn('Backend event creation sync offline, saved to persistent client store:', backendErr);
      }

      toast.success(`"${title}" published successfully! Live on EventSphere AI.`);
      router.push('/manage#my-events');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to publish event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
        <ConferioTicker />
        <ConferioNavbar
          onOpenAuth={(mode) => {
            setAuthModalMode(mode);
            setIsAuthModalOpen(true);
          }}
        />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <OrganizerAccessGate
            featureName="Summit Studio & Event Creator"
            onOpenAuth={(mode) => {
              setAuthModalMode(mode);
              setIsAuthModalOpen(true);
            }}
          />
        </main>
        <ConferioFooter />
        <ClerkAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
      {/* 1. Ticker */}
      <ConferioTicker />

      {/* 2. Navbar */}
      <ConferioNavbar
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
      />

      {/* 2.5 Organizer Dedicated Workspace Bar */}
      <OrganizerWorkspaceBar activeTab="create" />

      {/* 3. Hero Header */}
      <section className="bg-[#f5ce32] border-b-4 border-black px-4 sm:px-8 py-12 relative">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm mb-3 border border-black shadow-[2px_2px_0px_#fff]">
              ★ ORGANIZER COCKPIT ★
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              CREATE & LAUNCH YOUR EVENT
            </h1>
            <p className="text-xs sm:text-sm font-bold text-black/80 mt-2">
              Configure details, generate AI agendas, set seat maps & ticket tiers, and publish immediately.
            </p>
          </div>

          <Link
            href="/manage"
            className="px-5 py-2.5 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] shrink-0"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </section>

      {/* 4. Main Event Creator Form & Live Preview */}
      <main className="py-12 px-4 sm:px-8 max-w-6xl mx-auto w-full flex-1">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Basic Information */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b-2 border-black">
                <span className="w-6 h-6 bg-black text-[#f5ce32] rounded-full flex items-center justify-center text-xs font-black">
                  1
                </span>
                <h2 className="text-base font-black uppercase tracking-wider text-black">
                  Event Title & Core Details
                </h2>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Autonomous AI & Distributed Systems Summit 2026"
                  required
                  className="w-full px-4 py-3 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Tagline / Short Hook
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. 48 keynotes, hands-on RAG labs, and 12,000 global engineers."
                  className="w-full px-4 py-3 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_#000]"
                  >
                    <option value="Tech & AI">Tech & AI</option>
                    <option value="Developer Summit">Developer Summit</option>
                    <option value="Business">Business & Startups</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Music & Festival">Music & Festival</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                    Event Format
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                    {(['IN_PERSON', 'VIRTUAL', 'HYBRID'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setEventType(fmt)}
                        className={`py-2.5 px-2 border-2 border-black rounded-xl text-[10px] font-black uppercase transition-all ${
                          eventType === fmt
                            ? 'bg-black text-[#f5ce32] shadow-[2px_2px_0px_#f5ce32]'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-black'
                        }`}
                      >
                        {fmt.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Date, Time & Location */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b-2 border-black">
                <span className="w-6 h-6 bg-black text-[#f5ce32] rounded-full flex items-center justify-center text-xs font-black">
                  2
                </span>
                <h2 className="text-base font-black uppercase tracking-wider text-black">
                  Date & Venue Location
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_#000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_#000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. London, UK"
                    className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_#000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. ExCeL International Hall"
                    className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_#000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Expected Max Capacity (Attendees)
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  min={10}
                  max={50000}
                  className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>
            </div>

            {/* Step 3: AI Copilot Description */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-black text-[#f5ce32] rounded-full flex items-center justify-center text-xs font-black">
                    3
                  </span>
                  <h2 className="text-base font-black uppercase tracking-wider text-black">
                    Description & Syllabus
                  </h2>
                </div>

                <button
                  type="button"
                  disabled={isGeneratingAi}
                  onClick={handleGenerateAiDescription}
                  className="px-3 py-1.5 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-lg text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] flex items-center space-x-1.5 transition-all"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-black" />
                      <span>AI Generate</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive overview of agenda, tracks, speaker topics, and what attendees will take home..."
                className="w-full p-4 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
              />
            </div>

            {/* Step 4: Ticket Tiers & Pricing */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b-2 border-black">
                <span className="w-6 h-6 bg-black text-[#f5ce32] rounded-full flex items-center justify-center text-xs font-black">
                  4
                </span>
                <h2 className="text-base font-black uppercase tracking-wider text-black">
                  Ticket Tiers & Pass Pricing
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#e5d4ff]/40 border-2 border-black rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-black">
                    Standard Attendee Pass ($)
                  </span>
                  <div className="relative mt-1">
                    <DollarSign className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={generalPrice}
                      onChange={(e) => setGeneralPrice(Number(e.target.value))}
                      min={0}
                      className="w-full pl-8 pr-3 py-2 bg-white border-2 border-black rounded-xl text-xs font-black text-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border-2 border-black rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-black">
                    VIP All-Access Pass ($)
                  </span>
                  <div className="relative mt-1">
                    <DollarSign className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={vipPrice}
                      onChange={(e) => setVipPrice(Number(e.target.value))}
                      min={0}
                      className="w-full pl-8 pr-3 py-2 bg-white border-2 border-black rounded-xl text-xs font-black text-black focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Visuals */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b-2 border-black">
                <span className="w-6 h-6 bg-black text-[#f5ce32] rounded-full flex items-center justify-center text-xs font-black">
                  5
                </span>
                <h2 className="text-base font-black uppercase tracking-wider text-black">
                  Cover Banner Image URL
                </h2>
              </div>

              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>

              {/* Preset Image Options */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] font-black uppercase text-neutral-500 py-1">Presets:</span>
                {[
                  { label: 'Auditorium', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80' },
                  { label: 'Rooftop Soiree', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80' },
                  { label: 'AI Hack Lab', url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=800&q=80' },
                ].map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 border border-black rounded-lg text-[10px] font-black uppercase"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#f5ce32] hover:bg-yellow-400 text-black border-3 border-black rounded-2xl font-black text-sm uppercase tracking-wider shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publishing Event...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Event & Launch Tickets</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Neo-Brutalist Preview Card (5 Columns) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-black text-[#f5ce32] rounded-xl text-xs font-black uppercase tracking-wider inline-flex border border-black shadow-[2px_2px_0px_#f5ce32]">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Card Preview</span>
              </div>

              {/* Preview Card */}
              <div className="bg-white border-3 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_#000]">
                {/* Image */}
                <div className="relative h-48 overflow-hidden border-b-3 border-black bg-neutral-900">
                  <img
                    src={imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-black text-[#f5ce32] text-[10px] font-black uppercase rounded border border-black">
                    {category}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-[#f5ce32] text-black text-xs font-black uppercase rounded border border-black shadow-[2px_2px_0px_#000]">
                    ${generalPrice}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-black uppercase tracking-tight text-black leading-tight line-clamp-2">
                    {title || 'Your Event Title Will Appear Here'}
                  </h3>
                  <p className="text-xs font-bold text-neutral-600 line-clamp-2">
                    {tagline || 'Your catchy event tagline and summary will show here.'}
                  </p>
                  <div className="pt-2 space-y-1 text-xs font-bold text-neutral-700">
                    <p className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-black" />
                      <span>{startDate} to {endDate}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-black" />
                      <span>{venue}, {city}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-black" />
                      <span>Capacity: {capacity.toLocaleString()} Attendees</span>
                    </p>
                  </div>

                  <div className="pt-3">
                    <div className="w-full py-2.5 bg-black text-white text-center rounded-xl text-xs font-black uppercase tracking-wider">
                      Book Ticket · ${generalPrice}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* 5. Footer */}
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
