'use client';

import React from 'react';
import { useAnalyticsData } from '@/features/analytics/hooks/useAnalyticsData';
import { RevenueMetricsOverview } from '@/features/analytics/components/RevenueMetricsOverview';
import { AttendanceConversionChart } from '@/features/analytics/components/AttendanceConversionChart';
import { DemographicsHeatmap } from '@/features/analytics/components/DemographicsHeatmap';
import { AiQuotaUsageChart } from '@/features/analytics/components/AiQuotaUsageChart';
import { BarChart3, Download, Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const { data, isLoading, exportExecutiveSummary } = useAnalyticsData();

  if (isLoading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-neutral-400 font-medium">Aggregating Financial BI & Telemetry Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Analytics & BI Hub</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Financial settlements, turnstile check-in yield, geographic demographics, and AI quota analytics</p>
        </div>
        <button
          onClick={exportExecutiveSummary}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export BI Executive PDF Report</span>
        </button>
      </div>

      {/* Revenue Financial Cards */}
      <RevenueMetricsOverview financials={data.financials} />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceConversionChart attendance={data.attendance} />
        <AiQuotaUsageChart aiUsage={data.aiUsage} />
      </div>

      <DemographicsHeatmap demographics={data.demographics} />
    </div>
  );
}
