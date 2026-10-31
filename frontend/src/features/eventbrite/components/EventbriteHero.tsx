'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Compass, Flame, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface EventbriteHeroProps {
  selectedCity: string;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export const EventbriteHero: React.FC<EventbriteHeroProps> = ({
  selectedCity,
  onSelectCategory,
  activeCategory,
}) => {
  const QUICK_TAGS = [
    { label: 'All Events', id: 'ALL' },
    { label: 'Tech & AI Summits', id: 'Technology & AI' },
    { label: 'Music & Concerts', id: 'Music' },
    { label: 'Business & Founders', id: 'Business' },
    { label: 'Food & Drink', id: 'Food & Drink' },
    { label: 'Free Events', id: 'FREE' },
    { label: 'This Weekend', id: 'WEEKEND' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1E0A3C] via-[#2E0E54] to-[#120524] text-white">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F05537]/20 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Visual Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-3xl space-y-4 sm:space-y-6">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-orange-200">
            <Flame className="w-3.5 h-3.5 text-[#F05537]" />
            <span>Discover Top Trending Events in {selectedCity === 'All Cities' ? 'India' : selectedCity}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Find your next <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-[#F05537] to-amber-300">
              unforgettable experience.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-purple-100/80 font-normal leading-relaxed max-w-2xl">
            From stadium-scale AI keynotes and developer hackathons to live music concerts, founders meetups, and food festivals. Reserve your passes today with instant Razorpay checkout.
          </p>

          {/* Quick Filter Tag Chips */}
          <div className="pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-purple-200/70 mb-2.5">
              Popular Searches:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/ai-studio"
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Studio & 5 ML Models</span>
              </Link>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onSelectCategory(tag.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === tag.id
                      ? 'bg-[#F05537] text-white shadow-md shadow-[#F05537]/30 scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/10'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
