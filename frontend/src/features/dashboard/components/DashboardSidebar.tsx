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
  Crown,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import {
  resolveHierarchyRole,
  hasHierarchyAccess,
  HIERARCHY_CONFIG,
  HierarchyRoleType,
} from '@/features/auth/utils/hierarchy';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  requiredRole?: HierarchyRoleType;
}

const PRIMARY_NAV: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Tickets & Passes', href: '/portal', icon: Ticket, requiredRole: 'USER' },
  { label: 'Browse Events', href: '/events', icon: CalendarDays },
  { label: 'Organizer Cockpit', href: '/manage', icon: Users, badge: 'Live', requiredRole: 'EVENT_MANAGER' },
  { label: 'Create Event', href: '/events/create', icon: CalendarDays, requiredRole: 'EVENT_MANAGER' },
  { label: 'Attendees & Queue', href: '/registrations', icon: Users, requiredRole: 'EVENT_MANAGER' },
  { label: 'Turnstile Scanner', href: '/scanner', icon: Scan, requiredRole: 'EVENT_MANAGER' },
];

const SECONDARY_NAV: NavItem[] = [
  { label: 'AI Studio', href: '/ai-studio', icon: Sparkles, badge: 'Live ML', requiredRole: 'EVENT_MANAGER' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, requiredRole: 'EVENT_MANAGER' },
  { label: 'Company Admin', href: '/admin', icon: Zap, requiredRole: 'ADMIN' },
  { label: 'Settings', href: '/settings', icon: Settings, requiredRole: 'ADMIN' },
];

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const currentRole: HierarchyRoleType = user ? resolveHierarchyRole(user.role) : 'USER';
  const roleMeta = HIERARCHY_CONFIG[currentRole];

  // Filter navigation items by hierarchy power
  const filteredPrimary = PRIMARY_NAV.filter((item) => {
    if (!item.requiredRole) return true;
    return hasHierarchyAccess(user?.role, item.requiredRole);
  });

  const filteredSecondary = SECONDARY_NAV.filter((item) => {
    if (!item.requiredRole) return true;
    return hasHierarchyAccess(user?.role, item.requiredRole);
  });

  const renderLink = (item: NavItem) => {
    const isActive =
      pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all group ${
          isActive
            ? 'bg-black text-[#f5ce32] border-2 border-black shadow-[2px_2px_0px_#f5ce32] -translate-y-[1px]'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon
            className={`w-4 h-4 transition-colors ${
              isActive ? 'text-[#f5ce32]' : 'text-neutral-500 group-hover:text-neutral-300'
            }`}
          />
          <span>{item.label}</span>
        </div>
        {item.badge ? (
          <span className="px-2 py-0.5 text-[9px] font-black bg-[#f5ce32] text-black rounded uppercase tracking-wider">
            {item.badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-neutral-950 border-r-2 border-black flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b-2 border-black bg-neutral-900 shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#f5ce32] text-black font-black text-xs rounded-lg flex items-center justify-center border border-black shadow-[2px_2px_0px_#000]">
            ES
          </div>
          <div className="min-w-0">
            <span className="text-sm font-black text-white tracking-tighter uppercase leading-tight truncate block group-hover:text-[#f5ce32] transition-colors">
              EVENT SPHERE AI
            </span>
            <span className="text-[9px] text-[#f5ce32] font-black uppercase tracking-wider block">
              COCKPIT 2026
            </span>
          </div>
        </Link>

        <Link
          href="/"
          title="Visit Live Summit Home"
          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#f5ce32] hover:text-black text-neutral-400 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Navigation Filtered by Role */}
      <div className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">
            Operations
          </p>
          {filteredPrimary.map(renderLink)}
        </div>

        {filteredSecondary.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-neutral-800">
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">
              Intelligence
            </p>
            {filteredSecondary.map(renderLink)}
          </div>
        )}
      </div>

      {/* User Footer Card with Hierarchy Level Badge */}
      <div className="p-3 border-t-2 border-black bg-neutral-900 shrink-0">
        <Link
          href="/portal"
          className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition-colors group"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className={`w-7 h-7 rounded-lg border border-black flex items-center justify-center text-xs font-black shrink-0 ${
                currentRole === 'ADMIN'
                  ? 'bg-purple-600 text-white'
                  : currentRole === 'EVENT_MANAGER'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {currentRole === 'ADMIN' ? '👑' : currentRole === 'EVENT_MANAGER' ? '🏢' : '👤'}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-black text-white truncate block leading-none">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Alex Mercer'}
              </span>
              <span className="text-[9px] font-bold text-neutral-400 truncate block mt-0.5">
                {roleMeta.badgeTitle}
              </span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors shrink-0" />
        </Link>
      </div>
    </aside>
  );
};
