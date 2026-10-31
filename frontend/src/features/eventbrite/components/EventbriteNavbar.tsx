'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Heart,
  Ticket,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  Calendar,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { useTheme } from 'next-themes';

export const CITIES = [
  'All Cities',
  'Bengaluru',
  'Mumbai',
  'Delhi-NCR',
  'Hyderabad',
  'Pune',
  'Goa',
  'Online',
];

interface EventbriteNavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCity: string;
  setSelectedCity: (c: string) => void;
  likedCount: number;
  onOpenLikes: () => void;
  onOpenTickets: () => void;
  onSearchSubmit?: () => void;
}

export const EventbriteNavbar: React.FC<EventbriteNavbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  likedCount,
  onOpenLikes,
  onOpenTickets,
  onSearchSubmit,
}) => {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111114]/95 backdrop-blur-md border-b border-[#EEEDF2] dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2 sm:gap-4">
          {/* 1. Eventbrite Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F05537] flex items-center justify-center text-white shadow-md shadow-[#F05537]/25 group-hover:scale-105 transition-transform">
              <span className="font-black text-lg sm:text-xl tracking-tighter">e</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1E0A3C] dark:text-white leading-none">
                event<span className="text-[#F05537]">sphere</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#6F7287] dark:text-neutral-400 mt-0.5">
                India Event Hub
              </span>
            </div>
          </Link>

          {/* 2. Dual Search Pill (The Signature Eventbrite Search) */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
            <div className="flex items-center w-full bg-[#F8F7FA] dark:bg-neutral-900 border border-[#DBDAE3] dark:border-neutral-700 hover:border-[#6F7287] dark:hover:border-neutral-500 rounded-full py-1.5 px-3 shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#F05537]/30 focus-within:border-[#F05537]">
              {/* Keyword Search */}
              <div className="flex items-center flex-1 min-w-0 pr-2">
                <Search className="w-4 h-4 text-[#6F7287] dark:text-neutral-400 shrink-0 ml-1 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search events, tech, music, artists..."
                  className="w-full bg-transparent text-xs sm:text-sm text-[#1E0A3C] dark:text-neutral-100 placeholder-[#6F7287] dark:placeholder-neutral-500 outline-none"
                />
              </div>

              {/* Divider */}
              <div className="h-5 w-px bg-[#DBDAE3] dark:bg-neutral-700 shrink-0" />

              {/* Location Dropdown */}
              <div className="relative shrink-0 pl-2">
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1E0A3C] dark:text-neutral-200 hover:text-[#F05537] transition-colors py-1 px-2 rounded-lg"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#F05537] shrink-0" />
                  <span className="max-w-[100px] truncate">{selectedCity}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6F7287]" />
                </button>

                {isCityDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-[#EEEDF2] dark:border-neutral-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6F7287] dark:text-neutral-400 border-b border-gray-100 dark:border-neutral-800 mb-1">
                      Select Location
                    </div>
                    {CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                          selectedCity === city
                            ? 'bg-[#F05537]/10 text-[#F05537]'
                            : 'text-[#1E0A3C] dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <span>{city}</span>
                        {selectedCity === city && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F05537]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Search Button */}
              <button
                type="button"
                onClick={onSearchSubmit}
                className="ml-2 w-8 h-8 rounded-full bg-[#F05537] hover:bg-[#D1410C] flex items-center justify-center text-white shrink-0 shadow-sm transition-transform active:scale-95"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Right Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Find Events link */}
            <a
              href="#events-catalog"
              className="hidden lg:inline-flex text-xs font-bold text-[#1E0A3C] dark:text-neutral-200 hover:text-[#F05537] transition-colors py-2 px-2.5 rounded-lg"
            >
              Find Events
            </a>

            {/* Create Events / Host */}
            <Link
              href={isAuthenticated ? '/manage' : '/login?redirect=/manage'}
              className="hidden sm:inline-flex text-xs font-bold text-[#1E0A3C] dark:text-neutral-200 hover:text-[#F05537] transition-colors py-2 px-2.5 rounded-lg"
            >
              Create Events
            </Link>

            {/* AI Studio & ML Intelligence shortcut - Visible and prominent on all screens */}
            <Link
              href="/ai-studio"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white py-1.5 px-3 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 shadow-xs hover:shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0"
              title="Open AI Studio & Predictive Intelligence Engine"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>AI Studio</span>
            </Link>

            {/* Likes / Favorites */}
            <button
              onClick={onOpenLikes}
              className="relative p-2 text-[#1E0A3C] dark:text-neutral-200 hover:text-[#F05537] hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              title="Saved Events"
            >
              <Heart className={`w-5 h-5 ${likedCount > 0 ? 'fill-[#F05537] text-[#F05537]' : ''}`} />
              {likedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#F05537] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-50">
                  {likedCount}
                </span>
              )}
            </button>

            {/* My Tickets */}
            <button
              onClick={onOpenTickets}
              className="p-2 text-[#1E0A3C] dark:text-neutral-200 hover:text-[#F05537] hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              title="My Passes & Tickets"
            >
              <Ticket className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-[#1E0A3C] dark:text-neutral-200 hover:text-[#F05537] hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
              </button>
            )}

            {/* User Profile / Auth */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-gray-200 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-500 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#F05537] to-amber-500 flex items-center justify-center text-white font-bold text-xs">
                    {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-[#1E0A3C] dark:text-white max-w-[90px] truncate">
                    {user.firstName || 'Organizer'}
                  </span>
                  <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-[#6F7287]" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-[#EEEDF2] dark:border-neutral-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-neutral-800">
                      <p className="text-xs font-bold text-[#1E0A3C] dark:text-white truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[11px] text-[#6F7287] dark:text-neutral-400 truncate mt-0.5">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold bg-[#F05537]/10 text-[#F05537] rounded-md">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/ai-studio"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                      >
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>AI Studio & ML Models</span>
                      </Link>
                      <Link
                        href="/manage"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1E0A3C] dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800"
                      >
                        <Layers className="w-4 h-4 text-[#F05537]" />
                        <span>Organizer Management</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1E0A3C] dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800"
                      >
                        <Calendar className="w-4 h-4 text-[#3659E3]" />
                        <span>Enterprise Dashboard</span>
                      </Link>
                      <Link
                        href="/portal"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1E0A3C] dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800"
                      >
                        <Ticket className="w-4 h-4 text-emerald-500" />
                        <span>Attendee Portal & Passes</span>
                      </Link>
                      {user.role === 'ORGANIZATION_ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1E0A3C] dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-500" />
                          <span>Tenant Admin Center</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-neutral-800 pt-1">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          clearAuth();
                          router.push('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-bold text-[#1E0A3C] dark:text-white hover:text-[#F05537] px-3 py-2 rounded-full transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-[#F05537] hover:bg-[#D1410C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm shadow-[#F05537]/25 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#1E0A3C] dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="md:hidden pb-3">
          <div className="flex items-center w-full bg-[#F8F7FA] dark:bg-neutral-900 border border-[#DBDAE3] dark:border-neutral-700 rounded-full py-1.5 px-3">
            <Search className="w-4 h-4 text-[#6F7287] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, cities, artists..."
              className="w-full bg-transparent text-xs text-[#1E0A3C] dark:text-neutral-100 placeholder-[#6F7287] outline-none"
            />
          </div>
        </div>

        {/* Mobile Navigation Dropdown Tray */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#EEEDF2] dark:border-neutral-800 space-y-2 animate-in fade-in slide-in-from-top-2">
            <Link
              href="/ai-studio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-xs"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI Studio & Predictive Models</span>
            </Link>
            <Link
              href="#events-catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-xl text-[#1E0A3C] dark:text-white font-semibold text-xs hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              <Calendar className="w-4 h-4 text-[#F05537]" />
              <span>Find Events</span>
            </Link>
            <Link
              href="/manage"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-xl text-[#1E0A3C] dark:text-white font-semibold text-xs hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              <Layers className="w-4 h-4 text-[#3659E3]" />
              <span>Create Events & Management</span>
            </Link>
            <Link
              href="/portal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-xl text-[#1E0A3C] dark:text-white font-semibold text-xs hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              <Ticket className="w-4 h-4 text-emerald-500" />
              <span>My Passes & Attendee Wallet</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
