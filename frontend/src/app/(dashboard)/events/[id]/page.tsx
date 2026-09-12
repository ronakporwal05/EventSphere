'use client';

import React, { useEffect, useState, use } from 'react';
import { eventService } from '@/features/events/services/event.service';
import { EventItem } from '@/features/events/types/event.types';
import { SessionSpeakerManager } from '@/features/events/components/SessionSpeakerManager';
import { Calendar, MapPin, Users, Globe, ArrowLeft, CheckCircle, Edit, Copy, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getEventById(resolvedParams.id).then((res) => {
      setEvent(res);
      setLoading(false);
    });
  }, [resolvedParams.id]);

  if (loading || !event) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-medium">Loading Event Studio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Back Link */}
      <Link href="/events" className="inline-flex items-center text-xs text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        <span>Back to Events Studio</span>
      </Link>

      {/* Hero Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-900/40 via-neutral-900 to-purple-900/40 border border-neutral-800 rounded-2xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full uppercase tracking-wider w-fit">
            {event.status}
          </span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-xl inline-flex items-center space-x-1.5">
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-xl inline-flex items-center space-x-1.5">
              <Copy className="w-3.5 h-3.5" />
              <span>Clone Event</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-white tracking-tight">{event.title}</h1>
        <p className="text-xs text-neutral-300 max-w-3xl leading-relaxed">{event.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-800 text-xs text-neutral-300">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>{new Date(event.startDate).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>{event.registeredCount} / {event.capacity} Registered</span>
          </div>
        </div>
      </div>

      {/* Sessions & Keynote Speakers Manager */}
      <SessionSpeakerManager sessions={event.sessions} />
    </div>
  );
}
