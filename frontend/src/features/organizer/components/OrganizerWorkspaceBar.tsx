'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Plus,
  Sparkles,
  Scan,
  CreditCard,
  ExternalLink,
  Building,
} from 'lucide-react';

interface OrganizerWorkspaceBarProps {
  activeTab?: 'cockpit' | 'create' | 'ai-studio' | 'scanner' | 'plans';
}

export const OrganizerWorkspaceBar: React.FC<OrganizerWorkspaceBarProps> = ({ activeTab }) => {
  const pathname = usePathname();

  const currentTab =
    activeTab ||
    (pathname === '/manage'
      ? 'cockpit'
      : pathname === '/events/create'
      ? 'create'
      : pathname === '/ai-studio'
      ? 'ai-studio'
      : pathname === '/scanner'
      ? 'scanner'
      : pathname.includes('pricing')
      ? 'plans'
      : 'cockpit');

  const links = [
    { id: 'cockpit', href: '/manage', label: 'Cockpit & Revenue', icon: LayoutDashboard },
    { id: 'create', href: '/events/create', label: 'Create Event', icon: Plus },
    { id: 'ai-studio', href: '/ai-studio', label: 'AI Studio', icon: Sparkles },
    { id: 'scanner', href: '/scanner', label: 'Turnstile Scanner', icon: Scan },
    { id: 'plans', href: '/pricing?tab=organizer', label: 'Hosting Plans', icon: CreditCard },
  ];

  return (
    <div className="w-full bg-neutral-900 border-b-2 border-black text-white px-4 sm:px-8 py-2 z-30 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Workspace Brand Pill & Active Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-black text-[#f5ce32] rounded-lg text-xs font-black uppercase border border-neutral-700 shadow-[1px_1px_0px_#fff] shrink-0">
            <Building className="w-3.5 h-3.5 text-[#f5ce32]" />
            <span>ORGANIZER WORKSPACE</span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#f5ce32] text-black shadow-[2px_2px_0px_#000]'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Exit to Public Showcase */}
        <div className="flex items-center space-x-2 shrink-0">
          <Link
            href="/"
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-bold border border-neutral-700 flex items-center space-x-1.5 transition-all"
          >
            <span>Exit to Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
