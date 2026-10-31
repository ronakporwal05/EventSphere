'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

interface ConferioHeroProps {
  onBookSeatClick?: () => void;
}

export const ConferioHero: React.FC<ConferioHeroProps> = ({ onBookSeatClick }) => {
  // Live countdown timer state (target date: Jan 22, 2026)
  const [timeLeft, setTimeLeft] = useState({
    days: 140,
    hours: 0,
    minutes: 29,
    seconds: 56,
  });

  useEffect(() => {
    // Dynamic countdown timer
    const target = new Date('2026-01-22T09:00:00+05:30').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 140, hours: 0, minutes: 29, seconds: 56 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative w-full bg-[#f5ce32] text-black pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b-2 border-black">
      {/* Decorative Star Graphics */}
      <div className="absolute top-16 left-6 sm:left-16 pointer-events-none z-10 hidden sm:block">
        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#7dd3fc] drop-shadow-[2px_2px_0px_#000]" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L58 38 L96 46 L62 62 L70 100 L46 72 L22 100 L30 62 L-4 46 L38 38 Z" stroke="#000" strokeWidth="4" />
        </svg>
      </div>

      {/* Rotating Circular Stamp on the right */}
      <div className="absolute top-8 right-6 sm:right-16 pointer-events-none z-10 hidden md:block">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-[#d8b4fe] border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_#000]">
          {/* Circular SVG text spinning */}
          <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 160 160">
            <path
              id="circlePath"
              d="M 80, 80 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
              fill="none"
            />
            <text className="text-[12px] font-black uppercase tracking-[0.25em]" fill="#000">
              <textPath href="#circlePath">
                ★ 2026 EDITION ★ EVENT SPHERE AI ★
              </textPath>
            </text>
          </svg>
          {/* Centered Arrow */}
          <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white">
            <span className="text-xl font-black">↓</span>
          </div>
        </div>
      </div>

      {/* Hero Content Container */}
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-20">
        {/* Top Tilted Badge: Corporate Event */}
        <div className="inline-block transform -rotate-3 hover:rotate-0 transition-transform mb-4">
          <span className="px-4 py-1.5 bg-[#93c5fd] text-black font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black rounded-sm shadow-[3px_3px_0px_#000]">
            CORPORATE EVENT
          </span>
        </div>

        {/* Date and Location Badge */}
        <div className="relative inline-block transform rotate-2 hover:rotate-0 transition-transform mb-6">
          <div className="px-5 py-2 bg-[#f472b6] text-black font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black rounded-sm shadow-[3px_3px_0px_#000] flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 stroke-[3]" />
            <span>22-24 JAN 2026 • BENGALURU, INDIA</span>
          </div>
        </div>

        {/* Massive Neo-Brutalist Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-black leading-[0.88] mb-8 select-none">
          INNOVATORS<br />
          CONNECT EVENT<br />
          LIVE
        </h1>

        {/* Primary CTA: Book Your Seat */}
        <div className="mb-10">
          <button
            onClick={onBookSeatClick}
            type="button"
            className="group flex items-center space-x-3 px-8 py-3.5 bg-white text-black hover:bg-neutral-100 border-2 border-black rounded-full text-sm sm:text-base font-black tracking-wider uppercase shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
          >
            <span>Book Your Seat</span>
            <div className="w-6 h-6 bg-[#38bdf8] text-black rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform border border-black">
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>
        </div>

        {/* Live Countdown Timer Cards */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-16">
          <div className="bg-[#fef08a]/90 border-2 border-black rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[95px] text-center shadow-[3px_3px_0px_#000]">
            <span className="text-3xl sm:text-5xl font-black text-black block leading-none tabular-nums">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-neutral-800 block mt-1">
              DAYS
            </span>
          </div>

          <div className="bg-[#fef08a]/90 border-2 border-black rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[95px] text-center shadow-[3px_3px_0px_#000]">
            <span className="text-3xl sm:text-5xl font-black text-black block leading-none tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-neutral-800 block mt-1">
              HRS
            </span>
          </div>

          <div className="bg-[#fef08a]/90 border-2 border-black rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[95px] text-center shadow-[3px_3px_0px_#000]">
            <span className="text-3xl sm:text-5xl font-black text-black block leading-none tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-neutral-800 block mt-1">
              MINS
            </span>
          </div>

          <div className="bg-[#fef08a]/90 border-2 border-black rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[95px] text-center shadow-[3px_3px_0px_#000]">
            <span className="text-3xl sm:text-5xl font-black text-black block leading-none tabular-nums">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-neutral-800 block mt-1">
              SECS
            </span>
          </div>
        </div>

        {/* Asymmetrically Tilted Photo Gallery Strip */}
        <div className="w-full relative mt-4">
          {/* Yellow Sparkle Overlay on the right of images */}
          <div className="absolute -top-10 right-4 pointer-events-none z-30 hidden lg:block">
            <svg className="w-24 h-24 text-[#facc15] fill-[#facc15]" viewBox="0 0 100 100">
              <polygon points="50,0 60,35 95,50 60,65 50,100 40,65 5,50 40,35" stroke="#000" strokeWidth="3" />
            </svg>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-2">
            {/* Photo 1: Applause & Stage Energy */}
            <div className="relative transform -rotate-3 hover:rotate-0 transition-all duration-300 group">
              <div className="overflow-hidden rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] bg-neutral-900 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
                  alt="Keynote hall applause"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Photo 2: Interactive Audience Q&A */}
            <div className="relative transform rotate-2 hover:rotate-0 transition-all duration-300 group">
              <div className="overflow-hidden rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] bg-neutral-900 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80"
                  alt="Audience interactive question"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Photo 3: Dynamic Keynote Presenter */}
            <div className="relative transform -rotate-2 hover:rotate-0 transition-all duration-300 group">
              <div className="overflow-hidden rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] bg-neutral-900 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                  alt="Keynote presentation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Photo 4: Tech Founder on Stage */}
            <div className="relative transform rotate-3 hover:rotate-0 transition-all duration-300 group">
              <div className="overflow-hidden rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] bg-neutral-900 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80"
                  alt="Founder tech showcase"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
