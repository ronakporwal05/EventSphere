'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Ticket,
  Scan,
  Sparkles,
  BarChart3,
  Settings,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

// ─── Streamlined Navigation (8 core essentials) ───────────────────────────
const PRIMARY_NAV: NavItem[] = [
  { label: 'Overview',      href: '/dashboard',     icon: LayoutDashboard },
  { label: 'Events',        href: '/events',        icon: CalendarDays },
  { label: 'Attendees',     href: '/registrations', icon: Users },
  { label: 'Tickets',       href: '/tickets',       icon: Ticket },
  { label: 'QR Scanner',    href: '/scanner',       icon: Scan },
];

const SECONDARY_NAV: NavItem[] = [
  { label: 'AI Studio',     href: '/ai-studio',     icon: Sparkles, badge: 'Live AI' },
  { label: 'Analytics',     href: '/analytics',     icon: BarChart3 },
  { label: 'Settings',      href: '/settings',      icon: Settings },
];

export const navItems: NavItem[] = [...PRIMARY_NAV, ...SECONDARY_NAV];

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const renderLink = (item: NavItem) => {
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
    const Icon = item.icon;
    const isAi = !!item.badge;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
          isActive
            ? isAi
              ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 font-semibold shadow-sm'
              : 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold shadow-sm'
            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 transition-colors ${
            isActive
              ? isAi ? 'text-purple-400' : 'text-indigo-400'
              : 'text-neutral-500 group-hover:text-neutral-300'
          }`} />
          <span>{item.label}</span>
        </div>
        {item.badge ? (
          <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full uppercase tracking-wider">
            {item.badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <aside className="w-60 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-neutral-800 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <span className="text-sm font-bold text-white tracking-tight block leading-tight truncate">EventSphere</span>
          <span className="text-[10px] text-indigo-400 font-semibold tracking-wide block">Enterprise AI</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Management</p>
          {PRIMARY_NAV.map(renderLink)}
        </div>

        <div className="space-y-1 pt-2 border-t border-neutral-800/60">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Intelligence</p>
          {SECONDARY_NAV.map(renderLink)}
        </div>
      </div>

      {/* User Footer Card */}
      <div className="p-3 border-t border-neutral-800 shrink-0">
        <Link
          href="/profile"
          className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800/60 transition-colors group"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.firstName?.[0] || 'A'}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-semibold text-neutral-200 truncate block leading-none">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin User'}
              </span>
              <span className="text-[10px] text-neutral-500 truncate block mt-0.5">{user?.role || 'ORGANIZER'}</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-300 transition-colors shrink-0" />
        </Link>
      </div>
    </aside>
  );
};
