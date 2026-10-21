'use client';

import React from 'react';
import { Building2, Palette, Users, Layers, ShieldCheck, Settings } from 'lucide-react';

export type OrganizationTab = 'profile' | 'branding' | 'members' | 'departments' | 'roles' | 'settings';

interface OrganizationTabNavProps {
  activeTab: OrganizationTab;
  setActiveTab: (tab: OrganizationTab) => void;
}

export const OrganizationTabNav: React.FC<OrganizationTabNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'profile' as OrganizationTab, label: 'Profile', icon: Building2 },
    { id: 'branding' as OrganizationTab, label: 'Branding', icon: Palette },
    { id: 'members' as OrganizationTab, label: 'Members', icon: Users },
    { id: 'departments' as OrganizationTab, label: 'Departments', icon: Layers },
    { id: 'roles' as OrganizationTab, label: 'Roles & Matrix', icon: ShieldCheck },
    { id: 'settings' as OrganizationTab, label: 'Tenant Settings', icon: Settings },
  ];

  return (
    <div className="flex items-center space-x-2 border-b border-neutral-800 pb-px overflow-x-auto custom-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl flex items-center space-x-2 transition-all border-b-2 whitespace-nowrap ${
              isActive
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/40'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
