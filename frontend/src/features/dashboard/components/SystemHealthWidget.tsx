'use client';

import React from 'react';
import { Activity, ShieldCheck, Database, Cpu, HardDrive } from 'lucide-react';

interface SystemHealthWidgetProps {
  status: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
}

export const SystemHealthWidget: React.FC<SystemHealthWidgetProps> = ({ status }) => {
  const services = [
    { name: 'PostgreSQL Multi-Tenant DB', status: 'Operational', icon: Database },
    { name: 'Qdrant Vector Engine', status: 'Operational', icon: Cpu },
    { name: 'Redis Cache Cluster', status: 'Operational', icon: HardDrive },
    { name: 'Spring AI & Gemini Provider', status: 'Operational', icon: Activity },
  ];

  return (
    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">System Infrastructure Health</h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <div key={svc.name} className="p-3 bg-neutral-950/50 border border-neutral-800/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Icon className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-medium text-neutral-300">{svc.name}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
                {svc.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
