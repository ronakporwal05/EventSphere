'use client';

import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Search,
  ExternalLink,
  MessageCircle,
  Briefcase,
  MapPin,
  Coffee,
  CheckCircle2,
  TrendingUp,
  Tag,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

interface Attendee {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  avatar: string;
  bio: string;
  interests: string[];
  linkedinUrl: string;
  phone: string;
  matchScore?: number;
  matchReason?: string;
}

const ATTENDEE_DIRECTORY: Attendee[] = [
  {
    id: 'att-1',
    name: 'Priya Sharma',
    role: 'Principal Systems Architect',
    company: 'Razorpay Cloud',
    location: 'Bengaluru, India',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=140&h=140&q=80',
    bio: 'Designing high-throughput distributed locking, Kafka event logs, and UPI 2.0 payment pipelines.',
    interests: ['Redis', 'Distributed Systems', 'Fintech', 'Go', 'Kafka'],
    linkedinUrl: 'https://linkedin.com',
    phone: '9876543210',
    matchScore: 98,
    matchReason: 'Direct synergy: You both architect Redis distributed concurrency and payment verification protocols.',
  },
  {
    id: 'att-2',
    name: 'Karan Patel',
    role: 'Founding Partner',
    company: 'Venture Bharat Seed Fund',
    location: 'Mumbai, India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=140&h=140&q=80',
    bio: 'Early-stage investor backing GenAI infrastructure, multi-tenant enterprise software, and Developer tooling.',
    interests: ['Angel Investing', 'Enterprise SaaS', 'GenAI', 'Startups', 'Fintech'],
    linkedinUrl: 'https://linkedin.com',
    phone: '9820011223',
    matchScore: 95,
    matchReason: 'Investment opportunity: Karan is actively deploying pre-seed cheques into autonomous AI coding agents.',
  },
  {
    id: 'att-3',
    name: 'Sneha Reddy',
    role: 'Staff ML Engineer',
    company: 'Flipkart AI Labs',
    location: 'Hyderabad, India',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=140&h=140&q=80',
    bio: 'Building enterprise RAG with Gemini 1.5, dense vector search on Qdrant, and multi-tenant telemetry.',
    interests: ['Vector Databases', 'Qdrant', 'RAG', 'Gemini 1.5', 'Python'],
    linkedinUrl: 'https://linkedin.com',
    phone: '9848012345',
    matchScore: 92,
    matchReason: 'Technical alignment: Sneha optimizes Qdrant semantic collections and hybrid vector indexing.',
  },
  {
    id: 'att-4',
    name: 'Aditya Nair',
    role: 'Co-Founder & CTO',
    company: 'BharatCloud AI',
    location: 'Kochi, India',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=140&h=140&q=80',
    bio: 'Building sovereign LLM inference servers and low-latency microservices for Indian language processing.',
    interests: ['LLM Inference', 'Indic NLP', 'Kubernetes', 'FastAPI'],
    linkedinUrl: 'https://linkedin.com',
    phone: '9895012345',
    matchScore: 88,
    matchReason: 'Complementary stack: Aditya is integrating Indic translation APIs into conference stage setups.',
  },
  {
    id: 'att-5',
    name: 'Divya Krishnan',
    role: 'VP of Product',
    company: 'Swiggy Instamart',
    location: 'Bengaluru, India',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&h=140&q=80',
    bio: 'Product leader focused on hyper-local discovery, dynamic surge pricing algorithms, and high-conversion checkouts.',
    interests: ['Product Growth', 'Dynamic Pricing', 'UI/UX', 'Consumer Tech'],
    linkedinUrl: 'https://linkedin.com',
    phone: '9812345678',
    matchScore: 84,
    matchReason: 'Product inspiration: Divya designs rapid checkout funnels similar to BookMyShow and District.',
  },
];

export const SummitNetworkingDirectory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showOnlyAiMatches, setShowOnlyAiMatches] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = ['Redis', 'Fintech', 'GenAI', 'Qdrant', 'Startups', 'Kafka', 'Angel Investing'];

  const filteredAttendees = ATTENDEE_DIRECTORY.filter((att) => {
    const matchesSearch =
      att.name.toLowerCase().includes(search.toLowerCase()) ||
      att.role.toLowerCase().includes(search.toLowerCase()) ||
      att.company.toLowerCase().includes(search.toLowerCase()) ||
      att.bio.toLowerCase().includes(search.toLowerCase());

    const matchesTag = selectedTag ? att.interests.includes(selectedTag) : true;
    const matchesAi = showOnlyAiMatches ? (att.matchScore || 0) >= 90 : true;

    return matchesSearch && matchesTag && matchesAi;
  });

  const sendCoffeeInvite = (att: Attendee) => {
    const text = encodeURIComponent(
      `Hi ${att.name}! 👋 I saw your profile in the EventSphere AI Summit Directory. I loved your work on ${att.interests[0]}. Would love to grab a coffee at the Networking Lounge during the summit!`
    );
    window.open(`https://api.whatsapp.com/send?phone=91${att.phone}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-purple-950/40 via-neutral-900 to-amber-950/40 border border-purple-500/30 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> Luma-Style Attendee Directory
            </span>
            <span className="text-xs text-amber-400 font-bold font-mono">148 Delegates RSVP'd</span>
          </div>
          <h2 className="text-lg font-bold text-white">AI Smart Matchmaker & Summit Community</h2>
          <p className="text-xs text-neutral-400">
            Powered by Gemini 1.5 Flash. Discover founders, investors, and engineers in the room and connect before the keynote begins.
          </p>
        </div>

        {/* AI Matchmaker Trigger */}
        <button
          type="button"
          onClick={() => {
            setShowOnlyAiMatches(!showOnlyAiMatches);
            if (!showOnlyAiMatches) {
              toast.success('Gemini AI synthesized your top 3 high-affinity conference matches!');
            }
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
            showOnlyAiMatches
              ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-neutral-950 shadow-purple-500/20'
              : 'bg-neutral-800 hover:bg-neutral-700 text-purple-300 border border-purple-500/30'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>{showOnlyAiMatches ? 'Show All Delegates' : '✨ Gemini Top Matches (90%+ Match)'}</span>
        </button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-neutral-900/80 border border-neutral-800 rounded-2xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role, tech stack..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-[10px] no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedTag === null
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Interests
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedTag === tag
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Attendee Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAttendees.map((att) => (
          <div
            key={att.id}
            className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 transition-all hover:scale-[1.01] ${
              att.matchScore && att.matchScore >= 90
                ? 'bg-gradient-to-b from-purple-950/20 via-neutral-900 to-neutral-900 border-purple-500/30 shadow-lg shadow-purple-500/5'
                : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            <div className="space-y-3">
              {/* Top Profile Strip */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={att.avatar}
                    alt={att.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-purple-500/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{att.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                    </h3>
                    <p className="text-[11px] text-neutral-400 leading-tight">
                      {att.role}
                    </p>
                    <p className="text-[10px] text-amber-400 font-semibold">{att.company}</p>
                  </div>
                </div>

                {/* AI Affinity Score Badge */}
                {att.matchScore && (
                  <div className="px-2 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-right shrink-0">
                    <span className="text-[11px] font-bold font-mono text-purple-300 block">
                      {att.matchScore}%
                    </span>
                    <span className="text-[8px] text-neutral-400 uppercase font-semibold">AI Match</span>
                  </div>
                )}
              </div>

              {/* AI Synergy Reasoning */}
              {att.matchReason && (
                <div className="p-2.5 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Gemini Match Synthesis:</span>
                  </div>
                  <p className="text-[11px] text-purple-200/90 leading-relaxed italic">
                    "{att.matchReason}"
                  </p>
                </div>
              )}

              {/* Bio */}
              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {att.bio}
              </p>

              {/* Interest Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {att.interests.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-neutral-950 border border-neutral-800 rounded-md text-[10px] text-neutral-400 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <MapPin className="w-3 h-3 text-neutral-500" />
                <span>{att.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={att.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs transition-colors"
                  title="View LinkedIn Profile"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => sendCoffeeInvite(att)}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Coffee Invite</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
