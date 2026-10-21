'use client';

import React from 'react';
import { CampaignDeliveryStats } from '../types/notification.types';
import { Send, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

interface DeliveryStatusTrackerProps {
  stats: CampaignDeliveryStats;
}

export const DeliveryStatusTracker: React.FC<DeliveryStatusTrackerProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase">Total Messages Sent</span>
          <h3 className="text-xl font-bold text-white mt-1">{stats.totalSent.toLocaleString()}</h3>
        </div>
        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
          <Send className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase">Delivered</span>
          <h3 className="text-xl font-bold text-emerald-400 mt-1">{stats.delivered.toLocaleString()}</h3>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
          <CheckCircle className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase">Bounced / Failed</span>
          <h3 className="text-xl font-bold text-rose-400 mt-1">{stats.bounced}</h3>
        </div>
        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase">Email Open Rate</span>
          <h3 className="text-xl font-bold text-amber-400 mt-1">{stats.openRatePercentage}%</h3>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
          <Eye className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
