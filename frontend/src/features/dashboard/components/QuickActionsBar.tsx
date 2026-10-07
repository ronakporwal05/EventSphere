'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, UserPlus, Sparkles, Award, FileText, QrCode } from 'lucide-react';

export const QuickActionsBar: React.FC = () => {
  const actions = [
    { label: 'Create Event', href: '/events/new', icon: Plus, color: 'bg-indigo-600 hover:bg-indigo-500 text-white' },
    { label: 'Invite User', href: '/users?invite=true', icon: UserPlus, color: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' },
    { label: 'AI Content Studio', href: '/ai-studio', icon: Sparkles, color: 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30' },
    { label: 'Issue Certificate', href: '/certificates/issue', icon: Award, color: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' },
    { label: 'Generate AI Report', href: '/ai-studio/reports', icon: FileText, color: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' },
    { label: 'Scanner Mode', href: '/attendance/scanner', icon: QrCode, color: 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30' },
  ];

  return (
    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`p-3 rounded-xl text-xs font-medium flex flex-col items-center justify-center space-y-1.5 transition-all text-center ${action.color}`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate w-full">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
