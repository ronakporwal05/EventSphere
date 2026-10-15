'use client';

import React from 'react';
import { FinancialSummary } from '../types/analytics.types';
import { DollarSign, TrendingUp, CreditCard, RefreshCw } from 'lucide-react';

interface RevenueMetricsOverviewProps {
  financials: FinancialSummary;
}

export const RevenueMetricsOverview: React.FC<RevenueMetricsOverviewProps> = ({ financials }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Gross Ticket Revenue</span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">${financials.grossRevenue.toLocaleString()}</h3>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Net Settled Revenue</span>
          <h3 className="text-2xl font-black text-indigo-400 mt-1">${financials.netRevenue.toLocaleString()}</h3>
        </div>
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Tickets Sold</span>
          <h3 className="text-2xl font-black text-white mt-1">{financials.ticketsSold.toLocaleString()}</h3>
        </div>
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>

      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Avg Ticket Value</span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">${financials.avgTicketPrice.toFixed(2)}</h3>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <RefreshCw className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
