'use client';

import React from 'react';
import { TicketTierSummary } from '../types/ticket.types';
import { Ticket, DollarSign, Users, AlertCircle } from 'lucide-react';

interface TicketTierSummaryCardsProps {
  tiers: TicketTierSummary[];
}

export const TicketTierSummaryCards: React.FC<TicketTierSummaryCardsProps> = ({ tiers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiers.map((tier) => (
        <div key={tier.id} className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white truncate max-w-[150px]">{tier.name}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                tier.status === 'SOLD_OUT'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {tier.status}
            </span>
          </div>

          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-white">${tier.price}</span>
            <span className="text-[10px] text-neutral-400 uppercase">/ Pass</span>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
            <div className="flex justify-between text-[11px]">
              <span>Inventory Progress</span>
              <span className="font-semibold text-white">
                {tier.soldQuantity} / {tier.totalQuantity}
              </span>
            </div>
            <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${Math.min((tier.soldQuantity / tier.totalQuantity) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
