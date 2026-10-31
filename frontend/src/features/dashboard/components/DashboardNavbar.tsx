'use client';

import React from 'react';
import { Search, Bell, Sparkles, RefreshCw, Sun, Moon, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { useTheme } from 'next-themes';
import Link from 'next/link';

interface DashboardNavbarProps {
  onRefresh?: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ onRefresh }) => {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-neutral-900 border-b-2 border-black px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Quick Search Trigger */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <Link
          href="/events"
          className="w-full flex items-center space-x-3 px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-400 hover:text-white hover:border-[#f5ce32] transition-all cursor-pointer"
        >
          <Search className="w-4 h-4 text-neutral-500" />
          <span>Search events, attendees, RAG knowledge...</span>
          <kbd className="ml-auto px-1.5 py-0.5 text-[10px] bg-neutral-800 text-neutral-300 rounded border border-neutral-600 font-mono">
            ⌘K
          </kbd>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Data"
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <Link
          href="/notifications"
          className="relative p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f5ce32]" />
        </Link>

        <div className="h-6 w-px bg-neutral-800 mx-1" />

        {/* Live Summit Site Pill */}
        <Link
          href="/"
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
        >
          <span>Event Sphere AI</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </Link>

        {/* AI Quick Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-black border-2 border-[#f5ce32] rounded-xl text-xs text-[#f5ce32] font-black uppercase tracking-wider shadow-[2px_2px_0px_#f5ce32]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Gemini 1.5</span>
        </div>
      </div>
    </header>
  );
};
