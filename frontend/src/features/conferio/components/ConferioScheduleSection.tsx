'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, ArrowUpRight } from 'lucide-react';
import { getCurrentCalendarWindow } from '@/lib/calendar-utils';

interface SessionItem {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker: {
    name: string;
    role: string;
    avatar: string;
  };
  room: string;
  track: string;
  trackColor: string;
}

const SCHEDULE_DATA: Record<string, SessionItem[]> = {
  '2026-01-22': [
    {
      id: 's1',
      time: '09:30 AM - 10:45 AM',
      title: 'Opening Keynote: Autonomous AI Agents & Multi-Tenant Infrastructure',
      description: 'How modern cloud architectures leverage autonomous agent swarms, vector embeddings, and real-time streaming to orchestrate million-user events.',
      speaker: {
        name: 'Dr. Sarah Jenkins',
        role: 'VP of AI Research, DeepMind',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      room: 'Grand Auditorium A',
      track: 'KEYNOTE',
      trackColor: 'bg-[#93c5fd]',
    },
    {
      id: 's2',
      time: '11:15 AM - 12:45 PM',
      title: 'Algorithmic Dynamic Pricing: Maximizing Event Yield via Log-Log Elasticity Models',
      description: 'Mathematical deep-dive into real-time demand estimation, anti-gouging regulatory boundaries, and live ticket revenue simulation.',
      speaker: {
        name: 'Priya Sharma',
        role: 'Head of Quantitative Yield, EventSphere AI',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
      },
      room: 'Innovation Stage B',
      track: 'QUANT ML',
      trackColor: 'bg-[#facc15]',
    },
    {
      id: 's3',
      time: '02:00 PM - 03:30 PM',
      title: 'High-Concurrency Ticketing with Redis Distributed Locking & Spring Boot 3.3',
      description: 'Zero-loss seat reservation, idempotent payment webhooks, and preventing race conditions under 50,000 requests per second.',
      speaker: {
        name: 'Kevin Patel',
        role: 'Principal Cloud Architect, AWS',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      },
      room: 'Technical Hall C',
      track: 'SYSTEMS',
      trackColor: 'bg-[#c084fc]',
    },
    {
      id: 's4',
      time: '04:00 PM - 05:30 PM',
      title: 'Founders Fireside: Scaling From Pre-Seed to Unicorn Without Burning Out',
      description: 'Candid conversation with five tech founders on venture capital, product-market fit, and team culture in an AI-accelerated world.',
      speaker: {
        name: 'Alex Thorne',
        role: 'Managing Partner, Horizon Ventures',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      },
      room: 'Grand Auditorium A',
      track: 'VENTURE',
      trackColor: 'bg-[#f472b6]',
    },
  ],
  '2026-01-23': [
    {
      id: 's5',
      time: '10:00 AM - 11:30 AM',
      title: 'Qdrant RAG Knowledge Stores: Semantic Search on Event Proposals',
      description: 'Extracting deliverables and milestone dependencies from multi-page PDFs using hybrid sparse-dense vector search and LLMs.',
      speaker: {
        name: 'Elena Rostova',
        role: 'Head of AI Retrieval, VectorLabs',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      },
      room: 'Grand Auditorium A',
      track: 'AI / RAG',
      trackColor: 'bg-[#93c5fd]',
    },
    {
      id: 's6',
      time: '01:30 PM - 03:00 PM',
      title: 'Zero-Trust Gate Security: Tamper-Proof Cryptographic QR Passes',
      description: 'Offline-first hardware camera scanner validation using ed25519 signatures and sub-150ms verification queues.',
      speaker: {
        name: 'Marcus Vance',
        role: 'Chief Security Officer, GatePass',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      },
      room: 'Security Stage D',
      track: 'SECURITY',
      trackColor: 'bg-[#86efac]',
    },
    {
      id: 's7',
      time: '03:30 PM - 05:00 PM',
      title: 'Live Workshop: Building Real-Time Next.js 16 & React 19 Event Dashboards',
      description: 'Hands-on coding session exploring React Server Components, optimistic UI mutations, and state hydration with Zustand.',
      speaker: {
        name: 'Maya Lin',
        role: 'Staff Frontend Engineer, Vercel',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      },
      room: 'Hands-on Lab B',
      track: 'WORKSHOP',
      trackColor: 'bg-[#facc15]',
    },
  ],
  '2026-01-24': [
    {
      id: 's8',
      time: '09:30 AM - 11:00 AM',
      title: 'Crowd Density Estimation & Predictive Venue Safety with Computer Vision',
      description: 'Deploying edge models to predict room bottlenecks and session overcrowding before fire safety limits are reached.',
      speaker: {
        name: 'Dr. David Chen',
        role: 'Chief Vision Scientist, CrowdAI',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      room: 'Grand Auditorium A',
      track: 'VISION AI',
      trackColor: 'bg-[#f472b6]',
    },
    {
      id: 's9',
      time: '11:30 AM - 01:00 PM',
      title: 'Innovators Pitch Finale: 10 Startups Compete for $250,000 Seed Grant',
      description: 'Live stage presentations evaluated by top tier global venture investors and angel syndicates.',
      speaker: {
        name: 'Jury Panel',
        role: 'Top 5 Global Tech VCs',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      },
      room: 'Main Arena',
      track: 'PITCH LIVE',
      trackColor: 'bg-[#c084fc]',
    },
    {
      id: 's10',
      time: '02:30 PM - 04:30 PM',
      title: 'Closing Awards & Evening Networking Gala Celebration',
      description: 'Awarding the 2026 Innovation Trophies followed by the rooftop networking party and musical performance.',
      speaker: {
        name: 'Event Sphere AI Team',
        role: 'Host Committee',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      room: 'Sky Garden Terrace',
      track: 'AWARDS',
      trackColor: 'bg-[#facc15]',
    },
  ],
};

interface ConferioScheduleSectionProps {
  onSessionSelect?: (session: SessionItem) => void;
}

export const ConferioScheduleSection: React.FC<ConferioScheduleSectionProps> = ({ onSessionSelect }) => {
  const calendar = getCurrentCalendarWindow();
  const [selectedDay, setSelectedDay] = useState<string>(calendar.day1Iso);

  const days = [
    { key: calendar.day1Iso, label: `${calendar.day1Label.replace('Day 1 • ', '')}, ${calendar.currentYear}`, title: 'Day 1: AI & Systems' },
    { key: calendar.day2Iso, label: `${calendar.day2Label.replace('Day 2 • ', '')}, ${calendar.currentYear}`, title: 'Day 2: Architecture & Security' },
    { key: calendar.day3Iso, label: `${calendar.day3Label.replace('Day 3 • ', '')}, ${calendar.currentYear}`, title: 'Day 3: Pitch & Gala' },
  ];

  // Map dynamic calendar day to static session tracks
  const sessionDayMap: Record<string, string> = {
    [calendar.day1Iso]: '2026-01-22',
    [calendar.day2Iso]: '2026-01-23',
    [calendar.day3Iso]: '2026-01-24',
  };

  const scheduleKey = sessionDayMap[selectedDay] || '2026-01-22';
  const currentSessions = SCHEDULE_DATA[scheduleKey] || SCHEDULE_DATA['2026-01-22'] || [];

  return (
    <section id="schedule" className="relative w-full bg-[#fbfbf9] text-black py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
      <div className="max-w-6xl mx-auto">
        {/* Tilted Sticker Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-block transform -rotate-3 hover:rotate-0 transition-transform">
            <span className="px-3.5 py-1.5 bg-[#c084fc] text-black font-black text-xs uppercase tracking-wider border-2 border-black rounded-sm shadow-[3px_3px_0px_#000]">
              OUR EVENT
            </span>
          </div>
          <div className="inline-block transform rotate-2 hover:rotate-0 transition-transform">
            <span className="px-3.5 py-1.5 bg-[#facc15] text-black font-black text-xs uppercase tracking-wider border-2 border-black rounded-sm shadow-[3px_3px_0px_#000]">
              ANNUAL EVENT
            </span>
          </div>
        </div>

        {/* Big Stylized Heading */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-tight mb-4 select-none">
            JOIN US FOR EVENTS THAT<br />
            <span className="text-neutral-400">INSPIRE, CONNECT AND CELEBRATE.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-medium max-w-2xl">
            Choose your day to explore keynotes, workshops, and exclusive breakout discussions. All sessions feature interactive Q&A and networking.
          </p>
        </div>

        {/* Date Tabs (Reference Design Pill Buttons) */}
        <div className="flex flex-wrap gap-3 mb-10">
          {days.map((day) => {
            const isActive = selectedDay === day.key;
            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setSelectedDay(day.key)}
                className={`px-6 py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider border-2 border-black transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-[4px_4px_0px_#f5ce32] translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-white text-black hover:bg-neutral-100 shadow-[2px_2px_0px_#000]'
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>

        {/* Schedule Cards List */}
        <div className="space-y-4">
          {currentSessions.map((session) => (
            <div
              key={session.id}
              className="p-6 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              {/* Left Column: Time & Track */}
              <div className="md:w-1/4">
                <span
                  className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider border border-black rounded-sm shadow-[1.5px_1.5px_0px_#000] mb-2 ${session.trackColor}`}
                >
                  {session.track}
                </span>
                <div className="flex items-center space-x-1.5 text-xs font-black text-neutral-800">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{session.room}</span>
                </div>
              </div>

              {/* Center Column: Session Title & Description */}
              <div className="md:w-2/4">
                <h4 className="text-base sm:text-lg font-black text-black group-hover:text-amber-600 transition-colors mb-2 leading-snug">
                  {session.title}
                </h4>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed line-clamp-2">
                  {session.description}
                </p>
              </div>

              {/* Right Column: Speaker & Action */}
              <div className="md:w-1/4 flex items-center justify-between md:justify-end space-x-4 border-t md:border-t-0 pt-4 md:pt-0 border-neutral-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={session.speaker.avatar}
                    alt={session.speaker.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-black shadow-[2px_2px_0px_#000]"
                  />
                  <div>
                    <h5 className="text-xs font-black text-black">{session.speaker.name}</h5>
                    <p className="text-[10px] font-semibold text-neutral-500">{session.speaker.role}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSessionSelect?.(session)}
                  className="p-2.5 bg-neutral-100 hover:bg-[#f5ce32] border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] transition-colors"
                  title="Reserve Session Seat"
                >
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
