'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const ConferioFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success('Subscribed! You are on the 2026 VIP priority briefing list.');
  };

  const footerTicker =
    '★ LET\'S TALK ★ EVENT SPHERE AI 2026 ★ INNOVATORS CONNECT LIVE ★ SECURE YOUR PASS TODAY ★ PREDICTIVE AI & YIELD PLATFORM ★ ';

  return (
    <footer className="w-full bg-[#0a0a0a] text-white overflow-hidden border-t-2 border-black">
      {/* Big Neo-Brutalist Marquee Ticker */}
      <div className="w-full bg-[#f5ce32] text-black py-4 border-b-2 border-black select-none overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-xl sm:text-2xl font-black uppercase tracking-wider flex items-center">
          <span>{footerTicker}</span>
          <span>{footerTicker}</span>
          <span>{footerTicker}</span>
          <span>{footerTicker}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand Statement */}
          <div>
            <span className="text-3xl font-black tracking-tighter text-white uppercase block mb-3">
              EVENT SPHERE AI
            </span>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed mb-4">
              Innovators Connect Live 2026 is powered by Event Sphere AI’s predictive operations and microeconomic yield optimization architecture.
            </p>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-[#f5ce32]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Tenant Enterprise Ready</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Summit Pages
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-400">
              <li>
                <Link href="/" className="hover:text-[#f5ce32] transition-colors">
                  Home Summit
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#f5ce32] transition-colors">
                  About & Manifesto
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-[#f5ce32] transition-colors">
                  3-Day Schedule & Agenda
                </Link>
              </li>
              <li>
                <Link href="/speakers" className="hover:text-[#f5ce32] transition-colors">
                  Keynote Speakers Roster
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#f5ce32] transition-colors">
                  Passes & Seat Map
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#f5ce32] transition-colors">
                  Find Events Worldwide
                </Link>
              </li>
              <li>
                <Link href="/venue" className="hover:text-[#f5ce32] transition-colors">
                  Venue & Travel Logistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Management */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Organizer & Cockpit
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-400">
              <li>
                <Link href="/events/create" className="hover:text-[#f5ce32] transition-colors">
                  + Create New Event
                </Link>
              </li>
              <li>
                <Link href="/manage" className="hover:text-[#f5ce32] transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/scanner" className="hover:text-[#f5ce32] transition-colors">
                  Turnstile QR Scanner
                </Link>
              </li>
              <li>
                <Link href="/ai-studio" className="hover:text-[#f5ce32] transition-colors">
                  Predictive AI Studio
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#f5ce32] transition-colors">
                  Organization Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              VIP Briefing
            </h4>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed mb-3">
              Receive private speaker additions, hackathon announcements, and pricing alerts.
            </p>
            {subscribed ? (
              <div className="flex items-center space-x-2 text-xs font-black text-[#f5ce32]">
                <CheckCircle2 className="w-4 h-4" />
                <span>You're on the list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2.5 bg-neutral-900 border-2 border-neutral-700 text-xs font-medium text-white placeholder-neutral-500 rounded-l-lg focus:outline-none focus:border-[#f5ce32]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#f5ce32] text-black border-2 border-[#f5ce32] rounded-r-lg font-black hover:bg-yellow-400 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-neutral-500 gap-4">
          <p>© 2026 Event Sphere AI Platform. All rights reserved. Multi-Tenant Enterprise Architecture.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
