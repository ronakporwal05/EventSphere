'use client';

import React from 'react';

export const ConferioStatsSection: React.FC = () => {
  const stats = [
    { value: '20+', label: 'KEYNOTE TRACKS', color: 'text-black' },
    { value: '200+', label: 'GLOBAL SPEAKERS', color: 'text-black' },
    { value: '5K+', label: 'LIVE ATTENDEES', color: 'text-black' },
    { value: '30+', label: 'AI WORKSHOPS', color: 'text-black' },
    { value: '20+', label: 'UNICORN SPONSORS', color: 'text-black' },
  ];

  return (
    <section className="w-full bg-[#f5ce32] py-12 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-4 bg-white/70 backdrop-blur-sm border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000]"
          >
            <span className="text-4xl sm:text-5xl font-black block tracking-tighter text-black leading-none mb-1">
              {stat.value}
            </span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-neutral-800 block">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
