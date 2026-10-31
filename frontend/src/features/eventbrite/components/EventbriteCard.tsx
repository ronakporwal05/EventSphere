'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  Calendar,
  MapPin,
  Ticket,
  Sparkles,
  Users,
  Armchair,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';

export interface EventbriteCardData {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate?: string;
  location: string;
  city: string;
  venueName: string;
  imageUrl: string;
  price: number; // 0 for free
  formattedPrice: string;
  capacity: number;
  registeredCount: number;
  organizerName: string;
  badge?: string; // "Selling fast", "Trending", etc.
  hasSeatMap?: boolean;
  isVirtual?: boolean;
}

interface EventbriteCardProps {
  event: EventbriteCardData;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  onBookTickets: (event: EventbriteCardData) => void;
  onSelectSeats: (event: EventbriteCardData) => void;
}

export const EventbriteCard: React.FC<EventbriteCardProps> = ({
  event,
  isLiked,
  onToggleLike,
  onBookTickets,
  onSelectSeats,
}) => {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleLike(event.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} on EventSphere!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  return (
    <div className="group bg-white dark:bg-[#151419] rounded-2xl border border-[#EEEDF2] dark:border-neutral-800 shadow-xs hover:shadow-xl hover:border-gray-300 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* 1. Image Header Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top-Left Urgency Badge */}
        {event.badge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 dark:bg-neutral-900/95 text-[#F05537] shadow-sm backdrop-blur-xs">
            {event.badge}
          </div>
        )}

        {/* Top-Right Favorite (Heart) & Share Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShareClick}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 text-[#1E0A3C] dark:text-neutral-200 flex items-center justify-center shadow-md backdrop-blur-xs transition-transform active:scale-90"
            title="Share Event"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleLikeClick}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 flex items-center justify-center shadow-md backdrop-blur-xs transition-transform active:scale-90"
            title={isLiked ? 'Remove from Saved' : 'Save Event'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked
                  ? 'fill-[#F05537] text-[#F05537] scale-110'
                  : 'text-[#1E0A3C] dark:text-neutral-300 hover:text-[#F05537]'
              }`}
            />
          </button>
        </div>

        {/* Hybrid / Virtual Tag */}
        {event.isVirtual && (
          <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#1E0A3C]/80 text-white backdrop-blur-xs">
            Virtual & Live Stream
          </div>
        )}
      </div>

      {/* 2. Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Date & Time (Eventbrite's signature orange text) */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D1410C] dark:text-orange-400 uppercase tracking-wide">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{event.startDate}</span>
          </div>

          {/* Event Title */}
          <Link
            href={`/events/${event.id}`}
            className="block text-base sm:text-lg font-bold text-[#1E0A3C] dark:text-white group-hover:text-[#F05537] transition-colors line-clamp-2 leading-snug"
          >
            {event.title}
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[#6F7287] dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Location & Venue */}
          <div className="flex items-center gap-1.5 text-xs text-[#6F7287] dark:text-neutral-400 pt-1">
            <MapPin className="w-3.5 h-3.5 text-[#6F7287] dark:text-neutral-500 shrink-0" />
            <span className="truncate">{event.venueName}, {event.city}</span>
          </div>
        </div>

        {/* 3. Footer Metadata & Actions */}
        <div className="mt-4 pt-3.5 border-t border-[#EEEDF2] dark:border-neutral-800">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F7287] dark:text-neutral-400 block">
                Price
              </span>
              <span className="text-sm sm:text-base font-black text-[#1E0A3C] dark:text-white">
                {event.formattedPrice}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F7287] dark:text-neutral-400 block">
                Organizer
              </span>
              <span className="text-xs font-semibold text-[#1E0A3C] dark:text-neutral-200 truncate block max-w-[120px]">
                {event.organizerName}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onBookTickets(event)}
              className="flex-1 bg-[#F05537] hover:bg-[#D1410C] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Get Tickets</span>
            </button>

            {event.hasSeatMap && (
              <button
                type="button"
                onClick={() => onSelectSeats(event)}
                className="bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 text-[#1E0A3C] dark:text-white border border-[#DBDAE3] dark:border-neutral-700 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center gap-1 shadow-xs"
                title="Select Reserved Seats"
              >
                <Armchair className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Seats</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
