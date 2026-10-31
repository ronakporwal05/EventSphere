'use client';

import React from 'react';
import { ArrowUpRight, Globe, Share2 } from 'lucide-react';

interface Speaker {
  name: string;
  role: string;
  company: string;
  topic: string;
  avatar: string;
  bgColor: string;
}

export const ConferioSpeakersSection: React.FC = () => {
  const speakers: Speaker[] = [
    {
      name: 'SARAH JENKINS',
      role: 'VP OF AI RESEARCH',
      company: 'Google DeepMind',
      topic: 'Autonomous Multi-Agent Swarms',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bgColor: 'bg-[#ede9fe]', // Pastel Lilac
    },
    {
      name: 'DR. DAVID CHEN',
      role: 'CHIEF ML ARCHITECT',
      company: 'Meta AI Lab',
      topic: 'Real-Time Crowd Density Prediction',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bgColor: 'bg-[#d1fae5]', // Pastel Mint
    },
    {
      name: 'ELENA ROSTOVA',
      role: 'HEAD OF ENGINEERING',
      company: 'Qdrant Vector DB',
      topic: 'Hybrid Semantic Search & RAG',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      bgColor: 'bg-[#ffedd5]', // Pastel Peach
    },
    {
      name: 'MARCUS VANCE',
      role: 'VP OF PRODUCT SECURITY',
      company: 'Stripe / GatePass',
      topic: 'Tamper-Proof Hardware Gate QR',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bgColor: 'bg-[#e0f2fe]', // Pastel Sky Blue
    },
    {
      name: 'PRIYA SHARMA',
      role: 'QUANT YIELD ARCHITECT',
      company: 'EventSphere AI Quant',
      topic: 'Microeconomic Elasticity Curves',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
      bgColor: 'bg-[#fef9c3]', // Pastel Buttercup
    },
    {
      name: 'ALEX THORNE',
      role: 'MANAGING PARTNER',
      company: 'Apex Venture Fund',
      topic: 'Building AI Unicorns in 2026',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      bgColor: 'bg-[#fce7f3]', // Pastel Rose
    },
    {
      name: 'MAYA LIN',
      role: 'STAFF DESIGN ARCHITECT',
      company: 'Vercel / Next.js',
      topic: 'Next.js 16 Streaming SSR',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      bgColor: 'bg-[#ccfbf1]', // Pastel Teal
    },
    {
      name: 'KEVIN PATEL',
      role: 'PRINCIPAL CLOUD ARCHITECT',
      company: 'AWS Distributed Systems',
      topic: 'Zero-Downtime Event Operations',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      bgColor: 'bg-[#fee2e2]', // Pastel Coral
    },
  ];

  return (
    <section id="speakers" className="relative w-full bg-[#fbfbf9] text-black py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
      <div className="max-w-6xl mx-auto">
        {/* Tilted Sticker Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-block transform -rotate-3 hover:rotate-0 transition-transform">
            <span className="px-3.5 py-1.5 bg-[#93c5fd] text-black font-black text-xs uppercase tracking-wider border-2 border-black rounded-sm shadow-[3px_3px_0px_#000]">
              WORLD-CLASS LINEUP
            </span>
          </div>
          <div className="inline-block transform rotate-2 hover:rotate-0 transition-transform">
            <span className="px-3.5 py-1.5 bg-[#f472b6] text-black font-black text-xs uppercase tracking-wider border-2 border-black rounded-sm shadow-[3px_3px_0px_#000]">
              KEYNOTE HEROES
            </span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-tight select-none">
              MEET OUR VISIONARY<br />
              <span className="text-neutral-400">KEYNOTE SPEAKERS.</span>
            </h2>
            <p className="text-sm text-neutral-600 font-medium mt-2 max-w-xl">
              Learn directly from leaders driving modern AI, scalable distributed clouds, high-throughput financial systems, and venture creation.
            </p>
          </div>
        </div>

        {/* Speakers Grid (Reference Design with Pastel Card Frames) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {speakers.map((sp, idx) => (
            <div
              key={idx}
              className={`p-4 ${sp.bgColor} border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex flex-col justify-between group`}
            >
              <div>
                {/* Image Frame */}
                <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-black mb-4 bg-white">
                  <img
                    src={sp.avatar}
                    alt={sp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Topic Pill */}
                <span className="inline-block px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-wider rounded-sm mb-2">
                  {sp.topic}
                </span>

                {/* Speaker Name */}
                <h3 className="text-base font-black text-black uppercase tracking-tight leading-snug">
                  {sp.name}
                </h3>
                <p className="text-xs font-extrabold text-neutral-800 mt-0.5">{sp.role}</p>
                <p className="text-[11px] font-semibold text-neutral-600">{sp.company}</p>
              </div>

              {/* Social / Detail Trigger */}
              <div className="flex items-center justify-between border-t border-black/20 pt-3 mt-4">
                <div className="flex items-center space-x-2 text-neutral-700">
                  <Globe className="w-4 h-4 hover:text-black cursor-pointer" />
                  <Share2 className="w-4 h-4 hover:text-black cursor-pointer" />
                </div>
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
