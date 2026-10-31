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
  Search,
  MapPin,
  Calendar,
  Heart,
  Ticket,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  Users,
  Tag,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

interface EventCardItem {
  id: string;
  title: string;
  tagline: string;
  category: 'Tech & AI' | 'Developer Summit' | 'Music & Festival' | 'Business' | 'Design & UX';
  city: 'London' | 'Bengaluru' | 'San Francisco' | 'Tokyo' | 'Berlin' | 'Virtual';
  venue: string;
  startDate: string;
  dayBadge: string;
  monthBadge: string;
  price: number;
  capacity: number;
  attendeesCount: number;
  imageUrl: string;
  featured?: boolean;
}

const EVENTS_CATALOG: EventCardItem[] = [
  {
    id: 'evt-1',
    title: 'Innovators Connect Live Summit 2026',
    tagline: 'The flagship European gathering for AI architects, founders, and engineers.',
    category: 'Tech & AI',
    city: 'London',
    venue: 'ExCeL London Exhibition Arena',
    startDate: 'Jan 22 - 24, 2026',
    dayBadge: '22',
    monthBadge: 'JAN',
    price: 99,
    capacity: 2500,
    attendeesCount: 2180,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 'evt-2',
    title: 'Bengaluru AI & Vector Cloud Conclave',
    tagline: 'Deep dive into quantized inference, RAG architectures, and agent scaling.',
    category: 'Tech & AI',
    city: 'Bengaluru',
    venue: 'Whitefield Tech Center, Hall 4',
    startDate: 'Feb 15 - 16, 2026',
    dayBadge: '15',
    monthBadge: 'FEB',
    price: 49,
    capacity: 1200,
    attendeesCount: 940,
    imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'evt-3',
    title: 'Silicon Valley Founders & Venture Rodeo',
    tagline: 'Connect directly with top tier venture partners and seed syndicates.',
    category: 'Business',
    city: 'San Francisco',
    venue: 'Pier 27 Expo Terminal',
    startDate: 'Mar 08 - 10, 2026',
    dayBadge: '08',
    monthBadge: 'MAR',
    price: 199,
    capacity: 800,
    attendeesCount: 710,
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 'evt-4',
    title: 'Neo-Brutalist Design & Frontend Paradigms',
    tagline: 'Hands-on design systems and interactive streaming UI architectures.',
    category: 'Design & UX',
    city: 'Berlin',
    venue: 'Kraftwerk Innovation Center',
    startDate: 'Apr 03 - 04, 2026',
    dayBadge: '03',
    monthBadge: 'APR',
    price: 79,
    capacity: 650,
    attendeesCount: 520,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'evt-5',
    title: 'Tokyo Robotics & Edge Compute Summit',
    tagline: 'Real-time robotics operating systems, anycast networking, and sensor fleets.',
    category: 'Developer Summit',
    city: 'Tokyo',
    venue: 'Big Sight International Hall',
    startDate: 'May 12 - 14, 2026',
    dayBadge: '12',
    monthBadge: 'MAY',
    price: 120,
    capacity: 1500,
    attendeesCount: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'evt-6',
    title: 'Global Virtual Open Source HackFest',
    tagline: '48-hour decentralized hackathon with $50K prize pool for open source contributors.',
    category: 'Developer Summit',
    city: 'Virtual',
    venue: 'Online Worldwide Stream',
    startDate: 'Jun 20 - 22, 2026',
    dayBadge: '20',
    monthBadge: 'JUN',
    price: 0,
    capacity: 5000,
    attendeesCount: 3820,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  },
];

export default function FindEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<'All' | 'Free' | 'Paid'>('All');

  // Interactive booking & seat map states
  const [activeBookingEvent, setActiveBookingEvent] = useState<EventCardItem | null>(null);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSeatString, setSelectedSeatString] = useState<string | undefined>();

  // Auth modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('SIGN_IN');
  const [authContextMessage, setAuthContextMessage] = useState<string | undefined>();
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Tickets and Likes drawers
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [isLikesDrawerOpen, setIsLikesDrawerOpen] = useState(false);
  const [myTickets, setMyTickets] = useState<ConfirmedPass[]>([]);
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set(['evt-1']));

  // Gated action execution
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

  // Toggle favorite / like
  const handleToggleLike = (id: string) => {
    executeWithAuth(() => {
      setLikedEventIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          toast.info('Removed from Favorites');
        } else {
          next.add(id);
          toast.success('Added to your Favorites!');
        }
        return next;
      });
    }, 'Sign in to save events to your Favorites list.');
  };

  // Book ticket for event
  const handleBookEvent = (evt: EventCardItem) => {
    executeWithAuth(() => {
      setActiveBookingEvent(evt);
      setIsSeatMapOpen(true);
    }, `Sign in with Google to purchase tickets for ${evt.title}.`);
  };

  // Confirm seat
  const handleConfirmSeats = (seats: SelectedSeat[]) => {
    setIsSeatMapOpen(false);
    if (seats.length > 0) {
      const seatNames = seats.map((s) => `${s.row}-${s.number}`).join(', ');
      setSelectedSeatString(seatNames);
      setIsPaymentModalOpen(true);
      toast.success(`Selected seat: ${seatNames}. Loading payment...`);
    } else {
      setSelectedSeatString(undefined);
      setIsPaymentModalOpen(true);
    }
  };

  // Payment completed
  const handlePaymentSuccess = (ticketData?: any) => {
    setIsPaymentModalOpen(false);
    if (!activeBookingEvent) return;

    const newPass: ConfirmedPass = {
      id: `pass-${Date.now()}`,
      ticketNumber: ticketData?.ticketId || `TCK-ES-${Math.floor(1000 + Math.random() * 9000)}`,
      eventTitle: activeBookingEvent.title,
      date: activeBookingEvent.startDate,
      location: activeBookingEvent.venue,
      tier: 'General Pass',
      seat: selectedSeatString || 'General Hall',
      price: activeBookingEvent.price,
      status: 'CONFIRMED',
    };
    setMyTickets((prev) => [newPass, ...prev]);
    toast.success('Ticket confirmed! Your QR Pass is ready.');
    setIsTicketsModalOpen(true);
  };

  // Filter logic
  const filteredEvents = EVENTS_CATALOG.filter((evt) => {
    if (selectedCity !== 'All' && evt.city !== selectedCity) return false;
    if (selectedCategory !== 'All' && evt.category !== selectedCategory) return false;
    if (priceFilter === 'Free' && evt.price > 0) return false;
    if (priceFilter === 'Paid' && evt.price === 0) return false;
    if (
      searchQuery &&
      !evt.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !evt.tagline.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !evt.venue.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
      {/* 1. Marquee Ticker */}
      <ConferioTicker />

      {/* 2. Sticky Navbar */}
      <ConferioNavbar
        onOpenTickets={() => setIsTicketsModalOpen(true)}
        onOpenLikes={() => setIsLikesDrawerOpen(true)}
        onBuyTicketClick={() => handleBookEvent(EVENTS_CATALOG[0])}
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
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 bg-black text-[#f5ce32] text-xs font-black uppercase tracking-widest rounded-sm mb-4 border border-black shadow-[2px_2px_0px_#fff]">
              ★ DISCOVERY ENGINE ★
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none mb-4">
              FIND EVENTS & <br />
              <span className="underline decoration-black decoration-wavy decoration-2">
                TECH CONFERENCES
              </span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg font-bold text-black/80">
              Discover cutting-edge engineering summits, hands-on developer hackathons, and executive gatherings worldwide.
            </p>
          </div>

          <Link
            href="/events/create"
            className="px-6 py-3.5 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all shrink-0 inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-[#f5ce32] stroke-[3]" />
            <span>Host Your Own Event</span>
          </Link>
        </div>
      </section>

      {/* 4. Controls & Filter Bar */}
      <section className="bg-white border-b-4 border-black py-6 px-4 sm:px-8 sticky top-16 z-30 shadow-md">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, keyword, or venue..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-bold text-black placeholder-neutral-500 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
              />
            </div>

            {/* City / Location Dropdown */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3.5 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-xs font-black uppercase text-black focus:outline-none shadow-[2px_2px_0px_#000]"
              >
                <option value="All">All Cities</option>
                <option value="London">London, UK</option>
                <option value="Bengaluru">Bengaluru, IN</option>
                <option value="San Francisco">San Francisco, US</option>
                <option value="Tokyo">Tokyo, JP</option>
                <option value="Berlin">Berlin, DE</option>
                <option value="Virtual">Virtual / Online</option>
              </select>

              {/* Price Filter */}
              <div className="flex bg-neutral-100 p-1 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
                {(['All', 'Paid', 'Free'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      priceFilter === p ? 'bg-black text-[#f5ce32]' : 'text-neutral-700 hover:text-black'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {['All', 'Tech & AI', 'Developer Summit', 'Business', 'Design & UX'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#f5ce32] text-black shadow-[2px_2px_0px_#000]'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Events Grid */}
      <section className="py-14 px-4 sm:px-8 max-w-6xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-black">
          <span className="text-xs font-black uppercase text-neutral-500 tracking-wider">
            SHOWING {filteredEvents.length} UPCOMING EVENTS
          </span>
          <span className="text-xs font-bold text-neutral-700">
            Sorted by Date (Upcoming First)
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-white border-3 border-black rounded-3xl shadow-[6px_6px_0px_#000]">
            <p className="text-xl font-black uppercase text-black">No events match your criteria</p>
            <p className="text-xs text-neutral-500 font-bold mt-1">
              Try clearing your filters or changing your search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const isLiked = likedEventIds.has(event.id);
              const seatsLeft = event.capacity - event.attendeesCount;

              return (
                <div
                  key={event.id}
                  className="bg-white border-3 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Poster Image with Date Badge & Favorite Button */}
                    <div className="relative h-52 overflow-hidden border-b-3 border-black bg-neutral-900 group">
                      <Link href={`/events/${event.id}`} className="block w-full h-full">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Day & Month Badge */}
                      <div className="absolute top-3 left-3 bg-white border-2 border-black rounded-xl p-2 text-center shadow-[2px_2px_0px_#000] pointer-events-none">
                        <p className="text-xs font-black uppercase text-rose-600 leading-none">
                          {event.monthBadge}
                        </p>
                        <p className="text-lg font-black text-black leading-none mt-0.5">
                          {event.dayBadge}
                        </p>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={() => handleToggleLike(event.id)}
                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-black border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] transition-colors z-10"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isLiked ? 'fill-rose-500 text-rose-500' : 'text-black'
                          }`}
                        />
                      </button>

                      {/* Category Pill */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-black text-[#f5ce32] rounded text-[10px] font-black uppercase border border-black pointer-events-none">
                        {event.category}
                      </div>

                      {/* Price Pill */}
                      <div className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-[#f5ce32] text-black rounded text-xs font-black uppercase border border-black shadow-[2px_2px_0px_#000] pointer-events-none">
                        {event.price === 0 ? 'FREE' : `$${event.price}`}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-2.5">
                      <Link href={`/events/${event.id}`} className="block group">
                        <h3 className="text-lg font-black uppercase tracking-tight text-black leading-tight line-clamp-2 group-hover:text-[#f5ce32] transition-colors">
                          {event.title}
                        </h3>
                      </Link>

                      <p className="text-xs font-bold text-neutral-600 line-clamp-2 leading-relaxed">
                        {event.tagline}
                      </p>

                      <div className="pt-2 space-y-1.5 text-xs font-bold text-neutral-700">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                          <span className="truncate">{event.venue} ({event.city})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-3.5 h-3.5 text-black shrink-0" />
                          <span>{seatsLeft} Seats Remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions: View Details & Book Ticket */}
                  <div className="p-5 pt-0 flex items-center gap-2.5">
                    <Link
                      href={`/events/${event.id}`}
                      className="flex-1 py-3 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-1.5 text-center"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </Link>

                    <button
                      onClick={() => handleBookEvent(event)}
                      className="flex-1 py-3 bg-black hover:bg-neutral-800 text-white border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#f5ce32] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#f5ce32]" />
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. Footer */}
      <ConferioFooter />

      {/* Clerk Auth Modal */}
      <ClerkAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        contextMessage={authContextMessage}
        onSuccess={handleAuthSuccess}
      />

      {/* Interactive Seat Map Modal */}
      {activeBookingEvent && (
        <InteractiveSeatMap
          isOpen={isSeatMapOpen}
          onClose={() => setIsSeatMapOpen(false)}
          eventTitle={activeBookingEvent.title}
          onConfirmSeats={handleConfirmSeats}
        />
      )}

      {/* Payment Gateway Modal */}
      {activeBookingEvent && (
        <PaymentGatewayModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          eventTitle={activeBookingEvent.title}
          tierName="General Pass"
          price={activeBookingEvent.price}
          seatInfo={selectedSeatString}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

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
          handleBookEvent(EVENTS_CATALOG[0]);
        }}
      />
    </div>
  );
}
