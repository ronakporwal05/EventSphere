'use client';

import React, { useState, useEffect } from 'react';
import { ConferioTicker } from '@/features/conferio/components/ConferioTicker';
import { ConferioNavbar } from '@/features/conferio/components/ConferioNavbar';
import { ConferioHero } from '@/features/conferio/components/ConferioHero';
import { ConferioAboutSection } from '@/features/conferio/components/ConferioAboutSection';
import { ConferioScheduleSection } from '@/features/conferio/components/ConferioScheduleSection';
import { ConferioStatsSection } from '@/features/conferio/components/ConferioStatsSection';
import { ConferioSpeakersSection } from '@/features/conferio/components/ConferioSpeakersSection';
import { ConferioSponsorsSection } from '@/features/conferio/components/ConferioSponsorsSection';
import { ConferioPricingSection, TicketTier } from '@/features/conferio/components/ConferioPricingSection';
import { ConferioAiShowcase } from '@/features/conferio/components/ConferioAiShowcase';
import { ConferioVenueSection } from '@/features/conferio/components/ConferioVenueSection';
import { ConferioFooter } from '@/features/conferio/components/ConferioFooter';
import { SavedLikesDrawer } from '@/features/eventbrite/components/SavedLikesDrawer';
import { MyTicketsModal, ConfirmedPass } from '@/features/eventbrite/components/MyTicketsModal';
import { PaymentGatewayModal } from '@/features/tickets/components/PaymentGatewayModal';
import { InteractiveSeatMap, SelectedSeat } from '@/features/tickets/components/InteractiveSeatMap';
import { EventbriteCardData } from '@/features/eventbrite/components/EventbriteCard';
import { ClerkAuthModal, AuthModalMode } from '@/features/auth/components/ClerkAuthModal';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { toast } from 'sonner';

// Flagship Event details for booking & payment flow
const FLAGSHIP_EVENT: EventbriteCardData = {
  id: 'evt-global-2026',
  title: 'Innovators Connect Live 2026: Multi-Tenant AI & Cloud Summit',
  description: 'Three days of visionary keynotes, hands-on ML workshops, algorithmic dynamic pricing simulations, and venture networking.',
  category: 'Technology & AI',
  startDate: 'Wed, Jan 22, 2026 • 09:30 AM IST',
  location: 'KTPO Trade Center, Whitefield, Bengaluru',
  city: 'Bengaluru',
  venueName: 'KTPO Grand Auditorium',
  imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  price: 1999,
  formattedPrice: '₹1,999',
  capacity: 5000,
  registeredCount: 3420,
  organizerName: 'Event Sphere AI',
  badge: 'Selling Fast',
  hasSeatMap: true,
  isVirtual: false,
};

export default function EventSphereHomePage() {
  const { isAuthenticated, initialize } = useAuthStore();

  // Hydrate auth session on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Clerk Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('SIGN_IN');
  const [authContextMessage, setAuthContextMessage] = useState<string | undefined>();
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Saved likes & favorites
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('eventsphere_likes');
        return saved ? new Set(JSON.parse(saved)) : new Set(['evt-global-2026']);
      } catch {
        return new Set(['evt-global-2026']);
      }
    }
    return new Set(['evt-global-2026']);
  });

  // Confirmed ticket passes wallet
  const [myTickets, setMyTickets] = useState<ConfirmedPass[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('eventsphere_tickets');
        return saved
          ? JSON.parse(saved)
          : [
              {
                id: 'pass-sample-1',
                ticketNumber: 'TCK-ES-2026',
                eventTitle: 'Innovators Connect Live 2026: Keynote Pass',
                date: 'Wed, Jan 22, 2026 • 09:30 AM IST',
                location: 'KTPO Grand Auditorium, Bengaluru',
                tier: 'Pro All-Access Pass',
                seat: 'A-14',
                price: 1999,
                status: 'CONFIRMED',
              },
            ];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Modals & Drawers state
  const [isLikesDrawerOpen, setIsLikesDrawerOpen] = useState(false);
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Active booking context
  const [activeBookingEvent, setActiveBookingEvent] = useState<EventbriteCardData>(FLAGSHIP_EVENT);
  const [selectedSeatString, setSelectedSeatString] = useState<string | undefined>('A-14');

  // Persist likes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eventsphere_likes', JSON.stringify(Array.from(likedEventIds)));
    } catch {}
  }, [likedEventIds]);

  // Persist tickets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eventsphere_tickets', JSON.stringify(myTickets));
    } catch {}
  }, [myTickets]);

  // Gated Action System: Requires authentication before proceeding
  const executeWithAuth = (action: () => void, contextMsg?: string) => {
    if (useAuthStore.getState().isAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setAuthContextMessage(contextMsg || 'Please sign in or create an account with Google to continue.');
      setAuthModalMode('SIGN_IN');
      setIsAuthModalOpen(true);
    }
  };

  // Callback when Clerk auth succeeds
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (pendingAction) {
      const act = pendingAction;
      setPendingAction(null);
      act();
    }
  };

  // Toggle favorite / like (gated)
  const handleToggleLike = (id: string) => {
    executeWithAuth(() => {
      setLikedEventIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          toast.info('Removed from Saved Likes');
        } else {
          next.add(id);
          toast.success('Saved to your Likes!');
        }
        return next;
      });
    }, 'Sign in to save events and sync your bookmarks.');
  };

  // Open Likes Drawer (gated)
  const handleOpenLikes = () => {
    executeWithAuth(() => {
      setIsLikesDrawerOpen(true);
    }, 'Sign in to view your favorited events.');
  };

  // Open My Tickets Drawer (gated)
  const handleOpenTickets = () => {
    executeWithAuth(() => {
      setIsTicketsModalOpen(true);
    }, 'Sign in to view your verified QR pass wallet.');
  };

  // Scroll to pricing section when "Book Your Seat" is clicked (gated)
  const handleBookYourSeat = () => {
    executeWithAuth(() => {
      const el = document.getElementById('pricing');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 'Sign in with Google to book your conference passes.');
  };

  // Trigger seat selection / payment for a specific tier (gated)
  const handleSelectTier = (tier: TicketTier) => {
    executeWithAuth(() => {
      const eventWithTier: EventbriteCardData = {
        ...FLAGSHIP_EVENT,
        price: tier.price,
        formattedPrice: tier.formattedPrice,
        title: `Innovators Connect 2026 (${tier.name})`,
      };
      setActiveBookingEvent(eventWithTier);
      setIsSeatMapOpen(true);
    }, `Sign in to customize your seat and complete pass booking for ${tier.name}.`);
  };

  // Confirm seat selection and transition to payment modal
  const handleConfirmSeats = (seats: SelectedSeat[]) => {
    setIsSeatMapOpen(false);
    if (seats.length > 0) {
      const seatNames = seats.map((s) => `${s.row}-${s.number}`).join(', ');
      setSelectedSeatString(seatNames);
      setIsPaymentModalOpen(true);
      toast.success(`Selected seat: ${seatNames}. Preparing secure payment...`);
    } else {
      setSelectedSeatString(undefined);
      setIsPaymentModalOpen(true);
    }
  };

  // Payment success handler
  const handlePaymentSuccess = (ticketData?: any) => {
    setIsPaymentModalOpen(false);
    const newPass: ConfirmedPass = {
      id: `pass-${Date.now()}`,
      ticketNumber: ticketData?.ticketId || `TCK-ES-${Math.floor(1000 + Math.random() * 9000)}`,
      eventTitle: activeBookingEvent.title,
      date: activeBookingEvent.startDate,
      location: activeBookingEvent.location,
      tier: selectedSeatString ? 'Reserved Seating' : 'General Pass',
      seat: selectedSeatString || 'General Hall',
      price: activeBookingEvent.price,
      status: 'CONFIRMED',
    };
    setMyTickets((prev) => [newPass, ...prev]);
    toast.success('Ticket confirmed! QR Pass added to your My Tickets wallet.');
    setIsTicketsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-black font-sans selection:bg-black selection:text-[#f5ce32]">
      {/* 1. Scrolling Marquee Ticker */}
      <ConferioTicker />

      {/* 2. Neo-Brutalist Sticky Navbar with Clerk Login States */}
      <ConferioNavbar
        onOpenTickets={handleOpenTickets}
        onOpenLikes={handleOpenLikes}
        onBuyTicketClick={handleBookYourSeat}
        onOpenAuth={(mode, context) => {
          setAuthModalMode(mode);
          setAuthContextMessage(context);
          setPendingAction(null);
          setIsAuthModalOpen(true);
        }}
        likedCount={likedEventIds.size}
        ticketCount={myTickets.length}
      />

      {/* 3. Canary Yellow Hero Section with Tilted Badges, Rotating Stamp & Countdown */}
      <ConferioHero onBookSeatClick={handleBookYourSeat} />

      {/* 4. Matte Black "About Us" Mission & Gallery Section */}
      <ConferioAboutSection />

      {/* 5. Interactive Schedule & Date Selector Section */}
      <ConferioScheduleSection
        onSessionSelect={(session) => {
          executeWithAuth(() => {
            toast.info(`Session "${session.title}" selected! Choose your pass tier below.`);
            const el = document.getElementById('pricing');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 'Please sign in to reserve your seat for this keynote session.');
        }}
      />

      {/* 6. High-Contrast Stats Banner Row */}
      <ConferioStatsSection />

      {/* 7. Keynote Speakers Grid with Pastel Color Frames */}
      <ConferioSpeakersSection />

      {/* 8. Ecosystem Partners & Sponsors Box */}
      <ConferioSponsorsSection />

      {/* 9. Ticket Tiers & Perforated Cutout Pricing Cards */}
      <ConferioPricingSection onSelectTier={handleSelectTier} />

      {/* 10. EventSphere AI Intelligence & Dynamic Pricing Engine Showcase */}
      <ConferioAiShowcase />

      {/* 11. Venue Map, Directions & Transit Card */}
      <ConferioVenueSection />

      {/* 12. Neo-Brutalist Marquee Footer */}
      <ConferioFooter />

      {/* Clerk Authentication Modal (Google 1-Click + Normal Details) */}
      <ClerkAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        contextMessage={authContextMessage}
        onSuccess={handleAuthSuccess}
      />

      {/* Interactive Seat Selection Modal */}
      {isSeatMapOpen && (
        <InteractiveSeatMap
          isOpen={isSeatMapOpen}
          onClose={() => setIsSeatMapOpen(false)}
          eventTitle={activeBookingEvent.title}
          onConfirmSeats={handleConfirmSeats}
        />
      )}

      {/* Razorpay Payment Gateway Modal */}
      {isPaymentModalOpen && (
        <PaymentGatewayModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          eventTitle={activeBookingEvent.title}
          tierName="Pro All-Access Pass"
          price={activeBookingEvent.price}
          ticketTypeId="tier-vip-01"
          seatInfo={selectedSeatString}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Saved Likes Drawer */}
      <SavedLikesDrawer
        isOpen={isLikesDrawerOpen}
        onClose={() => setIsLikesDrawerOpen(false)}
        likedEvents={[FLAGSHIP_EVENT]}
        onRemoveLike={handleToggleLike}
        onBookTickets={() => {
          setIsLikesDrawerOpen(false);
          handleBookYourSeat();
        }}
      />

      {/* My Tickets QR Code Drawer */}
      <MyTicketsModal
        isOpen={isTicketsModalOpen}
        onClose={() => setIsTicketsModalOpen(false)}
        tickets={myTickets}
      />
    </div>
  );
}
