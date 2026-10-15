'use client';

import React from 'react';
import { RegionDemographic } from '../types/analytics.types';
import { Globe, Compass } from 'lucide-react';

interface DemographicsHeatmapProps {
  demographics: RegionDemographic[];
}

export const DemographicsHeatmap: React.FC<DemographicsHeatmapProps> = ({ demographics }) => {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-neutral-800">
        <Globe className="w-5 h-5 text-purple-400" />
        <h3 className="text-base font-bold text-white">Geographic & Regional Demographics</h3>
      </div>

      <div className="space-y-3">
        {demographics.map((item) => (
          <div key={item.region} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-neutral-300">
              <span>{item.region} ({item.country})</span>
              <span>{item.count.toLocaleString()} ({item.percentage}%)</span>
            </div>
            <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
