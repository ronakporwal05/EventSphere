'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Heart, ShieldCheck, ChevronDown } from 'lucide-react';

export const EventbriteFooter: React.FC = () => {
  return (
    <footer className="bg-[#1E0A3C] text-white pt-16 pb-12 border-t border-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">
              Use EventSphere
            </h4>
            <ul className="space-y-2 text-xs text-purple-200/80 font-medium">
              <li><Link href="/manage" className="hover:text-white transition-colors">Create Events</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">Pricing & Ticket Fees</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Event Marketing Tools</Link></li>
              <li><Link href="/scanner" className="hover:text-white transition-colors">Turnstile QR Check-in App</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">Attendee Pass Wallet</Link></li>
              <li><Link href="/ai-studio" className="hover:text-white transition-colors text-orange-300 font-bold">✨ AI Studio & ML Models</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">
              Plan Events
            </h4>
            <ul className="space-y-2 text-xs text-purple-200/80 font-medium">
              <li><Link href="/manage" className="hover:text-white transition-colors">Conference Management</Link></li>
              <li><Link href="/manage" className="hover:text-white transition-colors">Convention Management</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">3D Reserved Seat Mapping</Link></li>
              <li><Link href="/manage" className="hover:text-white transition-colors">Hackathons & Pitch Days</Link></li>
              <li><Link href="/manage" className="hover:text-white transition-colors">Delay Risk Forecasting</Link></li>
              <li><Link href="/manage" className="hover:text-white transition-colors">Ticket Fraud Detection</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">
              Find Events
            </h4>
            <ul className="space-y-2 text-xs text-purple-200/80 font-medium">
              <li><a href="#events-catalog" className="hover:text-white transition-colors">Bengaluru Events</a></li>
              <li><a href="#events-catalog" className="hover:text-white transition-colors">Mumbai Events</a></li>
              <li><a href="#events-catalog" className="hover:text-white transition-colors">Delhi-NCR Events</a></li>
              <li><a href="#events-catalog" className="hover:text-white transition-colors">Tech & AI Summits</a></li>
              <li><a href="#events-catalog" className="hover:text-white transition-colors">Free Entry Events</a></li>
              <li><a href="#events-catalog" className="hover:text-white transition-colors">Weekend Experiences</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">
              Connect With Us
            </h4>
            <ul className="space-y-2 text-xs text-purple-200/80 font-medium">
              <li><Link href="/portal" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">Help Center & FAQs</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">Cookie Preferences</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">Security & Compliance</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-200/60 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold tracking-tight">
              event<span className="text-[#F05537]">sphere</span>
            </span>
            <span>&copy; {new Date().getFullYear()} EventSphere, Inc. All rights reserved.</span>
          </div>

          {/* Country / Language Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-purple-200 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>India — English</span>
              <ChevronDown className="w-3 h-3 text-purple-300" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
