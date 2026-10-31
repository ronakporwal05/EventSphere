'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, CalendarPlus, ShieldCheck, Zap, ArrowRight, BarChart3, Scan } from 'lucide-react';

export const EventbriteOrganizerBanner: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E0A3C] via-[#2F1058] to-[#F05537] text-white p-8 sm:p-12 shadow-2xl">
        {/* Background glow & accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Powering Over 10,000+ Organizers Across India</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Host your next event <br className="hidden sm:inline" />
            with intelligent automation.
          </h2>

          <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed font-normal">
            Whether you&apos;re hosting an intimate masterclass or a 10,000-delegate tech conference: manage ticket tiers with Razorpay, predict execution delays with Random Forest AI, validate turnstile passes in &lt;100ms, and visualize reserved seating in real-time.
          </p>

          {/* Key capability pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-semibold text-white/90">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <Zap className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Instant Ticketing</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <BarChart3 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>AI Delay Prediction</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <Scan className="w-4 h-4 text-blue-300 shrink-0" />
              <span>&lt;100ms QR Scanner</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-purple-300 shrink-0" />
              <span>Fraud Detection</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/events"
              className="px-6 py-3.5 rounded-xl bg-white text-[#1E0A3C] hover:bg-orange-50 font-bold text-xs sm:text-sm shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4 text-[#F05537]" />
              <span>Create an Event</span>
            </Link>

            <Link
              href="/ai-studio"
              className="px-6 py-3.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-white font-bold text-xs sm:text-sm border border-purple-400/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Explore AI Studio</span>
            </Link>

            <Link
              href="/manage"
              className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Launch Organizer Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
