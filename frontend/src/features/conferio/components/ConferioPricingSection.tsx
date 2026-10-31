'use client';

import React from 'react';
import { Check, ArrowRight, Sparkles, Zap } from 'lucide-react';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  badge?: string;
  description: string;
  features: string[];
  bgColor: string;
  textColor: string;
  buttonBg: string;
  buttonText: string;
  isPopular?: boolean;
}

interface ConferioPricingSectionProps {
  onSelectTier?: (tier: TicketTier) => void;
}

export const ConferioPricingSection: React.FC<ConferioPricingSectionProps> = ({ onSelectTier }) => {
  const tiers: TicketTier[] = [
    {
      id: 'tier-standard',
      name: 'STANDARD PASS',
      price: 999,
      formattedPrice: '₹999',
      badge: 'EARLY BIRD',
      description: 'Ideal for students, developers, and individual builders seeking keynotes and expo access.',
      features: [
        'Full 3-Day Keynote Hall Access',
        'Developer Expo & Hack Showcase Entry',
        'Official Digital Certificate of Attendance',
        'Morning Coffee & Community Lunch',
        'Access to Live Session Recordings',
      ],
      bgColor: 'bg-[#ede9fe]', // Pastel Lilac
      textColor: 'text-black',
      buttonBg: 'bg-black hover:bg-neutral-800 text-white',
      buttonText: 'text-white',
    },
    {
      id: 'tier-pro',
      name: 'PRO ALL-ACCESS',
      price: 1999,
      formattedPrice: '₹1,999',
      badge: 'MOST POPULAR',
      description: 'Full conference access including hands-on workshops, reserved auditorium seating, and AI labs.',
      features: [
        'Everything in Standard Pass',
        'All Hands-on AI & Systems Workshops',
        'Reserved Priority Row Seating Map',
        'Speakers Lounge & Founders Fireside',
        'Exclusive 2026 Innovators Swag Bag',
        '1-Year Free Access to AI Studio Tools',
      ],
      bgColor: 'bg-[#18181b]', // Pitch Black / Charcoal
      textColor: 'text-white',
      buttonBg: 'bg-[#f5ce32] hover:bg-yellow-400 text-black',
      buttonText: 'text-black',
      isPopular: true,
    },
    {
      id: 'tier-vip',
      name: 'VIP EXECUTIVE',
      price: 4999,
      formattedPrice: '₹4,999',
      badge: 'LIMITED VIP',
      description: 'Complete executive experience with 1-on-1 investor matchmaking, private dining, and gala access.',
      features: [
        'Everything in Pro All-Access',
        'Front-Row Reserved Keynote Recliner',
        'Private VIP Gala Dinner & Cocktail Party',
        '1-on-1 Venture Capital Matchmaking Slot',
        'Executive Fast-Track Gate Entry Scanner',
        'Lifetime EventSphere AI Enterprise License',
      ],
      bgColor: 'bg-[#e0f2fe]', // Pastel Sky Blue
      textColor: 'text-black',
      buttonBg: 'bg-black hover:bg-neutral-800 text-white',
      buttonText: 'text-white',
    },
  ];

  return (
    <section id="pricing" className="relative w-full bg-[#fbfbf9] text-black py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
      <div className="max-w-6xl mx-auto">
        {/* Tilted Sticker Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-block transform -rotate-3 hover:rotate-0 transition-transform">
            <span className="px-3.5 py-1.5 bg-[#f472b6] text-black font-black text-xs uppercase tracking-wider border-2 border-black rounded-sm shadow-[3px_3px_0px_#000]">
              SECURE YOUR SPOT
            </span>
          </div>
          <div className="inline-block transform rotate-2 hover:rotate-0 transition-transform">
            <span className="px-3.5 py-1.5 bg-[#facc15] text-black font-black text-xs uppercase tracking-wider border-2 border-black rounded-sm shadow-[3px_3px_0px_#000]">
              LIMITED PASSES
            </span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="mb-14">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-tight mb-4 select-none">
            CHOOSE YOUR EVENT PASS<br />
            <span className="text-neutral-400">TRANSPARENT VALUE. NO HIDDEN FEES.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-medium max-w-2xl">
            Pick your tier to select your seat and proceed directly to secure checkout with UPI, Credit/Debit Cards, or Net Banking via Razorpay.
          </p>
        </div>

        {/* 3 Neo-Brutalist Ticket Cutout Cards (Reference Design) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative ${tier.bgColor} ${tier.textColor} border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex flex-col justify-between`}
            >
              {/* Top Perforation Notches on Sides */}
              <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-[#fbfbf9] rounded-full border-r-2 border-black -translate-y-1/2 pointer-events-none" />
              <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-[#fbfbf9] rounded-full border-l-2 border-black -translate-y-1/2 pointer-events-none" />

              <div>
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-md border border-white">
                    {tier.badge}
                  </span>
                  {tier.isPopular && (
                    <span className="flex items-center space-x-1 text-xs font-black text-[#f5ce32] uppercase tracking-wider">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Best Value</span>
                    </span>
                  )}
                </div>

                {/* Tier Name & Price */}
                <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-snug">
                  {tier.name}
                </h3>
                <div className="flex items-baseline space-x-1 mt-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-black tracking-tighter">
                    {tier.formattedPrice}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${tier.isPopular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    / per pass
                  </span>
                </div>

                <p className={`text-xs font-medium leading-relaxed mb-6 ${tier.isPopular ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {tier.description}
                </p>

                {/* Dotted Perforation Line */}
                <div className="w-full border-b-2 border-dashed border-black/30 my-6" />

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${tier.isPopular ? 'bg-[#f5ce32] text-black' : 'bg-black text-white'}`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="text-xs font-semibold leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectTier?.(tier)}
                className={`w-full py-3.5 px-6 ${tier.buttonBg} border-2 border-black rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center space-x-2 group`}
              >
                <span>Book Ticket</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
