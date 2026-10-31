'use client';

import React from 'react';
import { MapPin, Navigation, Train, Car, Plane } from 'lucide-react';

export const ConferioVenueSection: React.FC = () => {
  return (
    <section id="venue" className="w-full bg-[#fbfbf9] text-black py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#ede9fe] border-2 border-black rounded-3xl p-8 sm:p-12 shadow-[6px_6px_0px_#000]">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Left Column: Venue Info */}
            <div className="lg:w-1/2">
              <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-md mb-3">
                VENUE & LOCATION
              </span>
              <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black mb-4 select-none">
                FIND THE FASTEST ROUTE TO THE EVENT HALL
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed mb-6">
                Innovators Connect Live 2026 takes place at the premier convention hub in Bengaluru. Featuring world-class acoustics, executive breakout lounges, and high-speed multi-gigabit WiFi.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-wider text-black">Official Address</h5>
                    <p className="text-xs text-neutral-600 font-medium">KTPO Convention Center, EPIP Zone, Whitefield, Bengaluru, 560066</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
                  <Train className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-wider text-black">Metro Transit</h5>
                    <p className="text-xs text-neutral-600 font-medium">Purple Line Metro (Sri Sathya Sai Hospital Station) — 5 mins by cab / shuttle.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
                  <Plane className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-wider text-black">Airport Shuttle</h5>
                    <p className="text-xs text-neutral-600 font-medium">Direct KIAS Airport Express Buses every 30 minutes from BLR Terminal 1 & 2.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Map Frame */}
            <div className="lg:w-1/2 w-full">
              <div className="relative rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_#000] bg-neutral-900 aspect-[4/3] group">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                  alt="Venue Map Overview"
                  className="w-full h-full object-cover filter contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center space-x-2 text-[#f5ce32] font-black text-xs uppercase tracking-wider mb-1">
                    <Navigation className="w-4 h-4" />
                    <span>Interactive Map Coordinates</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">KTPO Grand Trade Center</h4>
                  <p className="text-[11px] text-neutral-300">Lat: 12.9815° N, Long: 77.7289° E</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
