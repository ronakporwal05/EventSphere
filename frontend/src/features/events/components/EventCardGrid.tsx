'use client';

import React from 'react';
import { EventItem } from '../types/event.types';
import { Calendar, MapPin, Users, Globe, Copy, CheckCircle, Archive, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface EventCardGridProps {
  events: EventItem[];
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
  onClone: (id: string) => void;
}

export const EventCardGrid: React.FC<EventCardGridProps> = ({
  events,
  onPublish,
  onArchive,
  onClone,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-neutral-700 transition-all group"
        >
          <div>
            {/* Header badges */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  event.status === 'PUBLISHED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : event.status === 'DRAFT'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                }`}
              >
                {event.status}
              </span>

              {event.isVirtual && (
                <span className="inline-flex items-center text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  <Globe className="w-3 h-3 mr-1" /> Virtual Hybrid
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
              {event.title}
            </h3>

            <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
              {event.description}
            </p>

            {/* Event details */}
            <div className="mt-4 space-y-2 text-xs text-neutral-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{new Date(event.startDate).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {event.registeredCount.toLocaleString()} / {event.capacity.toLocaleString()} Registered
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-neutral-950 text-neutral-400 text-[10px] rounded border border-neutral-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action bar */}
          <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              {event.status === 'DRAFT' && (
                <button
                  onClick={() => onPublish(event.id)}
                  title="Publish Event"
                  className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg border border-emerald-500/20"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => onClone(event.id)}
                title="Clone Event"
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onArchive(event.id)}
                title="Archive Event"
                className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
            </div>

            <Link
              href={`/events/${event.id}`}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center space-x-1"
            >
              <span>Manage Event</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
