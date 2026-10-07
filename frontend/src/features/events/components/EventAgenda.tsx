'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Bookmark,
  Share2,
  ExternalLink,
  Download,
  Sparkles,
  Users,
  Mic,
  Code,
  Rocket,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface Session {
  id: string;
  time: string;
  title: string;
  description: string;
  track: 'keynote' | 'labs' | 'pitch';
  room: string;
  speaker: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
  level: 'All Attendees' | 'Intermediate' | 'Advanced';
}

const AGENDA_SESSIONS: Session[] = [
  {
    id: 'ses-1',
    time: '09:30 AM - 10:30 AM',
    title: 'Opening Keynote: Sovereign GenAI & Multi-Tenant Agents in India',
    description: 'How Indian tech giants are deploying autonomous LLM agents with high-concurrency Redis caching, vector databases, and NPCI payment security.',
    track: 'keynote',
    room: 'Auditorium Hall A (Main Stage)',
    speaker: {
      name: 'Dr. Aarav Mehta',
      role: 'Chief AI Architect',
      company: 'EventSphere AI Research',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    },
    level: 'All Attendees',
  },
  {
    id: 'ses-2',
    time: '10:45 AM - 12:00 PM',
    title: 'Distributed Concurrency: Zero Double-Booking with Redis Distributed Locks',
    description: 'Deep dive into redlock algorithms, TTL expiration queues, and high-velocity flash sales handling 50k bookings per minute.',
    track: 'labs',
    room: 'Lab Arena 2 (Tech Wing)',
    speaker: {
      name: 'Priya Sharma',
      role: 'Principal Systems Architect',
      company: 'Razorpay & Cloud infra',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    },
    level: 'Advanced',
  },
  {
    id: 'ses-3',
    time: '10:45 AM - 12:00 PM',
    title: 'Seed to Series A: What Top Indian VCs Look for in AI Startups',
    description: 'Founders pitch directly to partner investors from Peak XV and Blume Ventures. Live term-sheet discussions and critique.',
    track: 'pitch',
    room: 'Executive Lounge Stage C',
    speaker: {
      name: 'Vikram Singhania',
      role: 'Managing Partner',
      company: 'Venture Bharat Fund',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    },
    level: 'All Attendees',
  },
  {
    id: 'ses-4',
    time: '01:30 PM - 02:45 PM',
    title: 'Hands-on Workshop: Building RAG with Gemini 1.5 Flash & Qdrant',
    description: 'Bring your laptop. We will build a semantic question-answering pipeline with sub-second vector search over 100k event documents.',
    track: 'labs',
    room: 'Lab Arena 2 (Tech Wing)',
    speaker: {
      name: 'Ananya Verma',
      role: 'Lead ML Engineer',
      company: 'Google Developer Group',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80',
    },
    level: 'Intermediate',
  },
  {
    id: 'ses-5',
    time: '03:00 PM - 04:15 PM',
    title: 'The Future of Bharat Fintech: UPI 2.0, Autopay & Digital Rupee',
    description: 'Panel discussion on the evolution of digital payments, offline QR check-ins, and biometric turnstiles at high-footfall venues.',
    track: 'keynote',
    room: 'Auditorium Hall A (Main Stage)',
    speaker: {
      name: 'Rohan Deshmukh',
      role: 'Director of Fintech Engineering',
      company: 'NPCI Ecosystems',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    },
    level: 'All Attendees',
  },
];

export const EventAgenda: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<'all' | 'keynote' | 'labs' | 'pitch'>('all');
  const [bookmarked, setBookmarked] = useState<string[]>(['ses-1']);

  const toggleBookmark = (id: string, title: string) => {
    if (bookmarked.includes(id)) {
      setBookmarked((prev) => prev.filter((item) => item !== id));
      toast.info(`Removed from your saved sessions.`);
    } else {
      setBookmarked((prev) => [...prev, id]);
      toast.success(`Bookmarked "${title}" to your schedule!`);
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (session: Session) => {
    const text = encodeURIComponent(session.title);
    const details = encodeURIComponent(`${session.description}\n\nSpeaker: ${session.speaker.name} (${session.speaker.role})`);
    const location = encodeURIComponent(`${session.room}, Bengaluru Arena, India`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}&dates=20261024T040000Z/20261024T053000Z`;
  };

  // Generate .ics calendar file
  const downloadIcs = (session: Session) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EventSphere AI//Event Agenda//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${session.title}`,
      `DESCRIPTION:${session.description.replace(/\n/g, ' ')}`,
      `LOCATION:${session.room}, Bengaluru, India`,
      'DTSTART:20261024T040000Z',
      'DTEND:20261024T053000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${session.id}-session.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded .ics calendar file for Apple Calendar & Outlook!');
  };

  const filteredSessions = activeTrack === 'all'
    ? AGENDA_SESSIONS
    : AGENDA_SESSIONS.filter((s) => s.track === activeTrack);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Controls & Track Switcher */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-orange-950/40 via-neutral-900 to-amber-950/40 border border-amber-500/20 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-bold uppercase tracking-wider">
              Sat, 24 Oct 2026 • 09:30 AM - 05:30 PM IST
            </span>
            <span className="text-xs text-neutral-400 font-mono">3 Parallel Tracks</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Multi-Track Summit Agenda & Speaker Schedule</h2>
          <p className="text-xs text-neutral-400">
            Bookmark key sessions or sync directly to Google Calendar and Apple iCal with 1 click.
          </p>
        </div>

        {/* Track Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-2xl overflow-x-auto text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTrack('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTrack === 'all'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Tracks ({AGENDA_SESSIONS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTrack('keynote')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTrack === 'keynote'
                ? 'bg-orange-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Keynote</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTrack('labs')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTrack === 'labs'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>AI Labs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTrack('pitch')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTrack === 'pitch'
                ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>VC Pitches</span>
          </button>
        </div>
      </div>

      {/* Session Cards List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => {
          const isSaved = bookmarked.includes(session.id);

          return (
            <div
              key={session.id}
              className={`p-5 rounded-3xl border transition-all ${
                isSaved
                  ? 'bg-neutral-900 border-amber-500/40 shadow-lg shadow-orange-500/5'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Time & Track */}
                <div className="md:w-56 shrink-0 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{session.time}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        session.track === 'keynote'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : session.track === 'labs'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {session.track === 'keynote' ? '🎤 Keynote' : session.track === 'labs' ? '💻 Hands-on Lab' : '🚀 Pitch Arena'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 text-[10px]">
                      {session.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <MapPin className="w-3 h-3 text-neutral-500" />
                    <span className="truncate">{session.room}</span>
                  </div>
                </div>

                {/* Middle: Title, Description & Speaker */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white hover:text-amber-300 transition-colors">
                      {session.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      {session.description}
                    </p>
                  </div>

                  {/* Speaker Pill */}
                  <div className="flex items-center gap-3 p-2 bg-neutral-950/70 border border-neutral-800/80 rounded-2xl w-fit">
                    <img
                      src={session.speaker.avatar}
                      alt={session.speaker.name}
                      className="w-9 h-9 rounded-xl object-cover border border-amber-500/30"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{session.speaker.name}</span>
                      <span className="text-[10px] text-neutral-400 block">
                        {session.speaker.role} • <span className="text-amber-400">{session.speaker.company}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions (Bookmark, Calendar Sync) */}
                <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(session.id, session.title)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isSaved
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-neutral-950' : ''}`} />
                    <span>{isSaved ? 'Bookmarked' : 'Save'}</span>
                  </button>

                  <a
                    href={getGoogleCalendarUrl(session)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Add directly to Google Calendar"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Google Cal</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadIcs(session)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Download iCal file for Apple Calendar or Outlook"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>iCal (.ics)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
