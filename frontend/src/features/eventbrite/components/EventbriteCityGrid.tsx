'use client';

import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

interface CityDestination {
  name: string;
  tagline: string;
  eventsCount: number;
  imageUrl: string;
}

const CITIES: CityDestination[] = [
  {
    name: 'Bengaluru',
    tagline: 'Silicon Valley of India',
    eventsCount: 340,
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Mumbai',
    tagline: 'Entertainment & Financial Capital',
    eventsCount: 280,
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Delhi-NCR',
    tagline: 'Heritage & National Conclaves',
    eventsCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hyderabad',
    tagline: 'Cyberabad & Tech Parks',
    eventsCount: 180,
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Pune',
    tagline: 'Automotive & Startup Innovation',
    eventsCount: 120,
    imageUrl: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Goa',
    tagline: 'Festivals, Retreats & Music',
    eventsCount: 95,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
  },
];

interface EventbriteCityGridProps {
  onSelectCity: (city: string) => void;
}

export const EventbriteCityGrid: React.FC<EventbriteCityGridProps> = ({ onSelectCity }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-[#EEEDF2] dark:border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#1E0A3C] dark:text-white">
            Explore Events in Top Cities
          </h2>
          <p className="text-xs sm:text-sm text-[#6F7287] dark:text-neutral-400 mt-1">
            Discover trending conferences, concerts, and workshops across India
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() => onSelectCity(city.name)}
            className="group relative h-48 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 text-left focus:outline-none"
          >
            {/* Background Image */}
            <img
              src={city.imageUrl}
              alt={city.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Content at Bottom */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h3 className="text-sm font-black tracking-tight flex items-center gap-1 group-hover:text-orange-300 transition-colors">
                <MapPin className="w-3 h-3 text-[#F05537] shrink-0" />
                <span>{city.name}</span>
              </h3>
              <p className="text-[10px] text-gray-300 font-medium mt-0.5">
                {city.eventsCount}+ events
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
