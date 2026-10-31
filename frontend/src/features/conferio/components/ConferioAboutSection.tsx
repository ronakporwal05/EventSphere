'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const ConferioAboutSection: React.FC = () => {
  return (
    <section id="about" className="relative w-full bg-[#111111] text-white py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-black overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Tilted Sticker Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="inline-block transform -rotate-3 hover:rotate-0 transition-transform">
            <span className="px-3.5 py-1.5 bg-[#facc15] text-black font-black text-xs uppercase tracking-wider border-2 border-black rounded-sm shadow-[3px_3px_0px_#fff]">
              ABOUT US
            </span>
          </div>
          <div className="inline-block transform rotate-2 hover:rotate-0 transition-transform">
            <span className="px-3.5 py-1.5 bg-[#c084fc] text-black font-black text-xs uppercase tracking-wider border-2 border-black rounded-sm shadow-[3px_3px_0px_#fff]">
              LIVE EVENT
            </span>
          </div>
        </div>

        {/* Semi-transparent Ghost Headline & Bold Text */}
        <div className="mb-14">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neutral-400/50 leading-tight mb-4 select-none">
            WE BELIEVE THAT EVERY EVENT SHOULD BE MORE THAN JUST A GATHERING —{' '}
            <span className="text-white">IT SHOULD IGNITE A REVOLUTION.</span>
          </h2>
          <p className="max-w-3xl text-sm sm:text-base text-neutral-400 font-medium leading-relaxed">
            Welcome to the flagship edition of Innovators Connect Live 2026. Across 3 immersive days, 200+ industry pioneers, founders, and engineers meet to explore next-generation intelligence, microservices architecture, and real-time operations.
          </p>
        </div>

        {/* 4 Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group overflow-hidden rounded-2xl border-2 border-neutral-700 bg-neutral-900 shadow-[4px_4px_0px_#333]">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80"
                alt="Audience engagement"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-neutral-900 border-t border-neutral-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#f5ce32] block mb-1">
                Audience Energy
              </span>
              <h4 className="text-sm font-extrabold text-white">Full-House Keynotes</h4>
            </div>
          </div>

          <div className="group overflow-hidden rounded-2xl border-2 border-neutral-700 bg-neutral-900 shadow-[4px_4px_0px_#333]">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80"
                alt="Workshop Collaboration"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-neutral-900 border-t border-neutral-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#93c5fd] block mb-1">
                Deep Dive Sessions
              </span>
              <h4 className="text-sm font-extrabold text-white">Hands-on AI Labs</h4>
            </div>
          </div>

          <div className="group overflow-hidden rounded-2xl border-2 border-neutral-700 bg-neutral-900 shadow-[4px_4px_0px_#333]">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80"
                alt="Founders Panel"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-neutral-900 border-t border-neutral-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#f472b6] block mb-1">
                Fireside Debates
              </span>
              <h4 className="text-sm font-extrabold text-white">Unfiltered Founder Talks</h4>
            </div>
          </div>

          <div className="group overflow-hidden rounded-2xl border-2 border-neutral-700 bg-neutral-900 shadow-[4px_4px_0px_#333]">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80"
                alt="Stage Performance"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-neutral-900 border-t border-neutral-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#c084fc] block mb-1">
                Executive Stage
              </span>
              <h4 className="text-sm font-extrabold text-white">Global Industry Leaders</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
