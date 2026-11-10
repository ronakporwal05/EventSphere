'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Ticket,
  Heart,
  Sparkles,
  ArrowRight,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Plus,
  CalendarDays,
  Menu,
  X as CloseIcon,
  Scan,
  ShieldCheck,
  Building,
  Crown,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import {
  resolveHierarchyRole,
  hasHierarchyAccess,
  HIERARCHY_CONFIG,
  HierarchyRoleType,
} from '@/features/auth/utils/hierarchy';
import { toast } from 'sonner';

interface ConferioNavbarProps {
  onOpenTickets?: () => void;
  onOpenLikes?: () => void;
  onBuyTicketClick?: () => void;
  onOpenAuth?: (mode: 'SIGN_IN' | 'SIGN_UP', context?: string) => void;
  likedCount?: number;
  ticketCount?: number;
}

export const ConferioNavbar: React.FC<ConferioNavbarProps> = ({
  onOpenTickets,
  onOpenLikes,
  onBuyTicketClick,
  onOpenAuth,
  likedCount = 0,
  ticketCount = 0,
}) => {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth, loginAsRole } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hierarchy role calculation
  const currentRole: HierarchyRoleType = isAuthenticated && user ? resolveHierarchyRole(user.role) : 'GUEST';
  const roleMeta = HIERARCHY_CONFIG[currentRole];

  // Hierarchy power flags
  const canAccessManagerTabs = hasHierarchyAccess(user?.role, 'EVENT_MANAGER'); // Level 2 & 3
  const canAccessAdminTabs = hasHierarchyAccess(user?.role, 'ADMIN'); // Level 3 only
  const isAttendeeOrHigher = isAuthenticated && user !== null; // Level 1, 2, 3

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    toast.success('Signed out. Switched to public guest mode.');
  };

  const handleBuyTicket = () => {
    setIsMobileMenuOpen(false);
    if (onBuyTicketClick) {
      onBuyTicketClick();
    } else {
      router.push('/pricing');
    }
  };

  const handleQuickRoleSwitch = (targetRole: 'ADMIN' | 'EVENT_MANAGER' | 'USER') => {
    const newUser = loginAsRole(targetRole);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    const targetLabel = HIERARCHY_CONFIG[targetRole].label;
    toast.success(`Switched role to ${targetLabel}! Navigation tabs updated.`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f5ce32] border-b-2 border-black px-4 sm:px-8 py-3.5 flex items-center justify-between select-none">
      {/* Brand Logo & Current Role Indicator */}
      <div className="flex items-center space-x-3">
        <Link href="/" className="group flex items-center space-x-2">
          <span className="text-2xl sm:text-3xl font-black tracking-tighter text-black uppercase group-hover:scale-[1.02] transition-transform">
            EVENT SPHERE AI
          </span>
          <span className="hidden sm:inline-block text-[10px] font-black uppercase px-2 py-0.5 bg-black text-[#f5ce32] rounded-full tracking-wider border border-black">
            2026 LIVE
          </span>
        </Link>

        {/* Current Active Hierarchy Level Pill (visible when logged in) */}
        {isAuthenticated && user && (
          <div
            className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2 shadow-[2px_2px_0px_#000] ${
              currentRole === 'ADMIN'
                ? 'bg-purple-900 text-purple-100 border-black'
                : currentRole === 'EVENT_MANAGER'
                ? 'bg-indigo-900 text-indigo-100 border-black'
                : 'bg-emerald-800 text-emerald-100 border-black'
            }`}
          >
            {currentRole === 'ADMIN' ? (
              <Crown className="w-3 h-3 text-[#f5ce32]" />
            ) : currentRole === 'EVENT_MANAGER' ? (
              <Briefcase className="w-3 h-3 text-[#93c5fd]" />
            ) : (
              <UserCheck className="w-3 h-3 text-emerald-300" />
            )}
            <span>{roleMeta.badgeTitle}</span>
          </div>
        )}
      </div>

      {/* Desktop Navigation Links — Clean Public Discovery */}
      <nav className="hidden lg:flex items-center space-x-5 text-xs font-black tracking-wider uppercase text-black">
        <Link href="/" className="hover:underline underline-offset-4 decoration-2 transition-all">
          Home
        </Link>
        <Link href="/events" className="hover:underline underline-offset-4 decoration-2 transition-all">
          Explore Events
        </Link>
        <Link href="/schedule" className="hover:underline underline-offset-4 decoration-2 transition-all">
          Schedule
        </Link>
        <Link href="/speakers" className="hover:underline underline-offset-4 decoration-2 transition-all">
          Speakers
        </Link>
        <Link href="/pricing?tab=attendee" className="hover:underline underline-offset-4 decoration-2 transition-all">
          Passes
        </Link>
        <Link href="/about" className="hover:underline underline-offset-4 decoration-2 transition-all">
          About
        </Link>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Host an Event CTA Button */}
        {canAccessManagerTabs ? (
          <Link
            href="/manage"
            className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-black text-[#f5ce32] hover:bg-neutral-800 border-2 border-black rounded-xl text-xs font-black tracking-wider uppercase shadow-[2px_2px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            <Building className="w-3.5 h-3.5 text-[#f5ce32]" />
            <span>Organizer Studio</span>
          </Link>
        ) : (
          <Link
            href="/pricing?tab=organizer"
            className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-xl text-xs font-black tracking-wider uppercase shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            <Building className="w-3.5 h-3.5 text-black" />
            <span>Host an Event</span>
          </Link>
        )}

        {/* Saved Likes Drawer Trigger */}
        <button
          onClick={onOpenLikes}
          type="button"
          aria-label="Favorites"
          className="relative p-2 bg-white/90 hover:bg-white text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
        >
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          {likedCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {likedCount}
            </span>
          )}
        </button>

        {/* My Tickets Drawer Trigger */}
        <button
          onClick={onOpenTickets}
          type="button"
          className="flex items-center space-x-1.5 px-3 py-2 bg-white/90 hover:bg-white text-black border-2 border-black rounded-lg text-xs font-black tracking-wider uppercase shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
        >
          <Ticket className="w-4 h-4 text-black" />
          <span className="hidden sm:inline">My Passes</span>
          {ticketCount > 0 && (
            <span className="bg-black text-[#f5ce32] text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {ticketCount}
            </span>
          )}
        </button>

        {/* User Account / Hierarchical Dropdown */}
        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              type="button"
              className="flex items-center space-x-2 px-3 py-1.5 bg-white border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_#000] hover:bg-neutral-50 transition-colors"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white border border-black ${
                  currentRole === 'ADMIN'
                    ? 'bg-purple-600'
                    : currentRole === 'EVENT_MANAGER'
                    ? 'bg-indigo-600'
                    : 'bg-emerald-600'
                }`}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>{user.firstName?.charAt(0) || 'U'}</span>
                )}
              </div>
              <span className="hidden md:inline text-black font-extrabold max-w-[90px] truncate">
                {user.firstName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-600" />
            </button>

            {/* Dropdown Menu with Quick Hierarchy Switcher */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000] py-2.5 z-50 animate-in fade-in zoom-in-95">
                {/* User Header */}
                <div className="px-4 py-2 border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-black leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border ${
                        currentRole === 'ADMIN'
                          ? 'bg-purple-100 text-purple-900 border-purple-400'
                          : currentRole === 'EVENT_MANAGER'
                          ? 'bg-indigo-100 text-indigo-900 border-indigo-400'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      }`}
                    >
                      {roleMeta.badgeTitle}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 truncate mt-0.5">{user.email}</p>
                </div>

                {/* 1-CLICK HIERARCHICAL ROLE SWITCHER */}
                <div className="px-3 py-2.5 bg-neutral-50 border-b border-neutral-200">
                  <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block mb-1.5">
                    Switch Hierarchy Role:
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickRoleSwitch('ADMIN')}
                      className={`p-1.5 rounded-lg border-2 text-[9px] font-black uppercase text-center transition-all ${
                        currentRole === 'ADMIN'
                          ? 'bg-purple-600 text-white border-black shadow-[1px_1px_0px_#000]'
                          : 'bg-white hover:bg-purple-50 text-neutral-700 border-neutral-300'
                      }`}
                    >
                      👑 Admin
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickRoleSwitch('EVENT_MANAGER')}
                      className={`p-1.5 rounded-lg border-2 text-[9px] font-black uppercase text-center transition-all ${
                        currentRole === 'EVENT_MANAGER'
                          ? 'bg-indigo-600 text-white border-black shadow-[1px_1px_0px_#000]'
                          : 'bg-white hover:bg-indigo-50 text-neutral-700 border-neutral-300'
                      }`}
                    >
                      🏢 Manager
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickRoleSwitch('USER')}
                      className={`p-1.5 rounded-lg border-2 text-[9px] font-black uppercase text-center transition-all ${
                        currentRole === 'USER'
                          ? 'bg-emerald-600 text-white border-black shadow-[1px_1px_0px_#000]'
                          : 'bg-white hover:bg-emerald-50 text-neutral-700 border-neutral-300'
                      }`}
                    >
                      👤 User
                    </button>
                  </div>
                </div>

                {/* Navigation Items Categorized by Audience */}
                <div className="py-1">
                  {/* Category: Attendee Hub */}
                  <div className="px-4 py-1 text-[9px] font-black uppercase tracking-wider text-neutral-400">
                    🎟️ Attendee Hub
                  </div>
                  <Link
                    href="/portal"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full px-4 py-1.5 text-left text-xs font-bold text-neutral-800 hover:bg-neutral-100 flex items-center space-x-2"
                  >
                    <Ticket className="w-3.5 h-3.5 text-black" />
                    <span>Digital Pass Wallet</span>
                  </Link>

                  {/* Category: Organizer Studio */}
                  <div className="px-4 pt-2.5 pb-1 text-[9px] font-black uppercase tracking-wider text-neutral-400 border-t border-neutral-100 mt-1">
                    🏢 Organizer Studio
                  </div>
                  {canAccessManagerTabs ? (
                    <>
                      <Link
                        href="/manage"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full px-4 py-1.5 text-left text-xs font-bold text-neutral-800 hover:bg-neutral-100 flex items-center space-x-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Cockpit & Analytics</span>
                      </Link>

                      <Link
                        href="/events/create"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full px-4 py-1.5 text-left text-xs font-bold text-neutral-800 hover:bg-neutral-100 flex items-center space-x-2"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Create New Event</span>
                      </Link>

                      <Link
                        href="/scanner"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full px-4 py-1.5 text-left text-xs font-bold text-neutral-800 hover:bg-neutral-100 flex items-center space-x-2"
                      >
                        <Scan className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Turnstile Scanner</span>
                      </Link>

                      <Link
                        href="/ai-studio"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full px-4 py-1.5 text-left text-xs font-bold text-neutral-800 hover:bg-neutral-100 flex items-center space-x-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>AI Studio</span>
                      </Link>

                      <Link
                        href="/pricing?tab=organizer"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full px-4 py-1.5 text-left text-xs font-bold text-neutral-800 hover:bg-neutral-100 flex items-center space-x-2"
                      >
                        <Building className="w-3.5 h-3.5 text-neutral-700" />
                        <span>Hosting Plans & Subscriptions</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/pricing?tab=organizer"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-4 py-1.5 text-left text-xs font-black text-indigo-700 hover:bg-indigo-50 flex items-center space-x-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Host Events (Activate Organizer Plan)</span>
                    </Link>
                  )}

                  {/* Level 3: Admin Only */}
                  {canAccessAdminTabs && (
                    <>
                      <div className="px-4 pt-2.5 pb-1 text-[9px] font-black uppercase tracking-wider text-purple-600 border-t border-purple-100 mt-1">
                        👑 System Admin
                      </div>
                      <Link
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full px-4 py-1.5 text-left text-xs font-black text-purple-700 hover:bg-purple-50 flex items-center space-x-2"
                      >
                        <Crown className="w-3.5 h-3.5 text-purple-600" />
                        <span>Multi-Tenant Admin Console</span>
                      </Link>
                    </>
                  )}
                </div>

                <div className="pt-1 border-t border-neutral-200">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out (Switch to Guest)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <button
              onClick={() => (onOpenAuth ? onOpenAuth('SIGN_IN') : router.push('/login'))}
              type="button"
              className="px-2.5 sm:px-3 py-2 bg-white/90 hover:bg-white text-black border-2 border-black rounded-lg text-xs font-black tracking-wider uppercase shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => (onOpenAuth ? onOpenAuth('SIGN_UP') : router.push('/register'))}
              type="button"
              className="hidden sm:inline-block px-3 py-2 bg-black text-white hover:bg-neutral-900 border-2 border-black rounded-lg text-xs font-black tracking-wider uppercase shadow-[2px_2px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Neo-brutalist Buy Ticket CTA */}
        <button
          onClick={handleBuyTicket}
          type="button"
          className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 bg-black text-white hover:bg-neutral-900 border-2 border-black rounded-lg text-xs font-black tracking-wider uppercase shadow-[3px_3px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all shrink-0"
        >
          <span>Buy Ticket</span>
          <div className="w-4 h-4 bg-[#f5ce32] text-black rounded flex items-center justify-center">
            <ArrowRight className="w-3 h-3 stroke-[3]" />
          </div>
        </button>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          type="button"
          aria-label="Toggle navigation menu"
          className="xl:hidden p-2 bg-black text-[#f5ce32] rounded-lg border-2 border-black shadow-[2px_2px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all ml-1"
        >
          {isMobileMenuOpen ? <CloseIcon className="w-4 h-4 stroke-[3]" /> : <Menu className="w-4 h-4 stroke-[3]" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown Navigation — Also Strictly Filtered by Hierarchy */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[65px] bg-[#f5ce32] border-b-4 border-black p-5 shadow-2xl z-50 animate-in slide-in-from-top-4 space-y-4 max-h-[calc(100vh-70px)] overflow-y-auto">
          {/* Quick Role Switcher on Mobile */}
          {isAuthenticated && (
            <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_#000]">
              <span className="text-[10px] font-black uppercase text-neutral-600 block mb-2">
                Active: {roleMeta.badgeTitle} — Switch Role:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleQuickRoleSwitch('ADMIN')}
                  className={`p-1.5 rounded-lg border text-[10px] font-black uppercase ${
                    currentRole === 'ADMIN' ? 'bg-purple-600 text-white' : 'bg-neutral-100 text-black'
                  }`}
                >
                  👑 Admin
                </button>
                <button
                  onClick={() => handleQuickRoleSwitch('EVENT_MANAGER')}
                  className={`p-1.5 rounded-lg border text-[10px] font-black uppercase ${
                    currentRole === 'EVENT_MANAGER' ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-black'
                  }`}
                >
                  🏢 Manager
                </button>
                <button
                  onClick={() => handleQuickRoleSwitch('USER')}
                  className={`p-1.5 rounded-lg border text-[10px] font-black uppercase ${
                    currentRole === 'USER' ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-black'
                  }`}
                >
                  👤 User
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {/* 1. Public Links */}
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-800 tracking-wider block mb-1.5 px-1">
                🌟 Public Discovery
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-black uppercase">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_#000] flex items-center justify-between"
                >
                  <span>Home</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/events"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_#000] flex items-center justify-between"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/schedule"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_#000] flex items-center justify-between"
                >
                  <span>Schedule</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/speakers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_#000] flex items-center justify-between"
                >
                  <span>Speakers</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/pricing?tab=attendee"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-black border-2 border-black rounded-xl text-[#f5ce32] shadow-[2px_2px_0px_#fff] flex items-center justify-between"
                >
                  <span>🎟️ Passes</span>
                  <ArrowRight className="w-3 h-3 text-[#f5ce32]" />
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_#000] flex items-center justify-between"
                >
                  <span>About</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* 2. Attendee Pass Wallet */}
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-800 tracking-wider block mb-1.5 px-1">
                🎟️ Attendee Wallet
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-black uppercase">
                <Link
                  href="/portal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_#000] flex items-center justify-between"
                >
                  <span>My Passes</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenLikes) onOpenLikes();
                  }}
                  className="p-2.5 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_#000] flex items-center justify-between"
                >
                  <span>Saved Likes ({likedCount})</span>
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                </button>
              </div>
            </div>

            {/* 3. Organizer Studio */}
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-800 tracking-wider block mb-1.5 px-1">
                🏢 For Organizers
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-black uppercase">
                <Link
                  href="/pricing?tab=organizer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_#000] flex items-center justify-between"
                >
                  <span>Host an Event</span>
                  <ArrowRight className="w-3 h-3 text-black" />
                </Link>
                <Link
                  href="/manage"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-black border-2 border-black rounded-xl text-white shadow-[2px_2px_0px_#000] flex items-center justify-between"
                >
                  <span>Cockpit</span>
                  <ArrowRight className="w-3 h-3 text-[#f5ce32]" />
                </Link>
                <Link
                  href="/events/create"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_#000] flex items-center justify-between"
                >
                  <span>+ Create Event</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/scanner"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_#000] flex items-center justify-between"
                >
                  <span>Turnstiles</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* 4. Admin (if applicable) */}
            {canAccessAdminTabs && (
              <div>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-purple-700 border-2 border-black rounded-xl text-white shadow-[2px_2px_0px_#000] flex items-center justify-between w-full text-xs font-black uppercase"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5 text-yellow-300" />
                    Admin Console
                  </span>
                  <ArrowRight className="w-3 h-3 text-white" />
                </Link>
              </div>
            )}
          </div>

          <div className="pt-2 border-t-2 border-black flex items-center gap-2">
            <Link
              href="/events/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-3 bg-white hover:bg-neutral-50 text-black border-2 border-black rounded-xl font-black text-xs uppercase text-center shadow-[3px_3px_0px_#000]"
            >
              + Create Event
            </Link>
            <button
              onClick={handleBuyTicket}
              className="flex-1 py-3 bg-black hover:bg-neutral-800 text-[#f5ce32] border-2 border-black rounded-xl font-black text-xs uppercase text-center shadow-[3px_3px_0px_#fff]"
            >
              Buy Passes
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
