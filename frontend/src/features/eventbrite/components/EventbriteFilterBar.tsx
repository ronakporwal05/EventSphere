'use client';

import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react';

interface EventbriteFilterBarProps {
  timeFilter: string;
  setTimeFilter: (t: string) => void;
  priceFilter: string;
  setPriceFilter: (p: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  totalCount: number;
  selectedCity: string;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const EventbriteFilterBar: React.FC<EventbriteFilterBarProps> = ({
  timeFilter,
  setTimeFilter,
  priceFilter,
  setPriceFilter,
  sortBy,
  setSortBy,
  totalCount,
  selectedCity,
  onClearFilters,
  hasActiveFilters,
}) => {
  const TIME_OPTIONS = [
    { label: 'All Dates', value: 'ALL' },
    { label: 'Today', value: 'TODAY' },
    { label: 'Tomorrow', value: 'TOMORROW' },
    { label: 'This Weekend', value: 'WEEKEND' },
    { label: 'Next Week', value: 'NEXT_WEEK' },
  ];

  const PRICE_OPTIONS = [
    { label: 'All Prices', value: 'ALL' },
    { label: 'Free Events', value: 'FREE' },
    { label: 'Paid Passes', value: 'PAID' },
  ];

  return (
    <div className="sticky top-18 sm:top-20 z-30 bg-[#F8F7FA]/95 dark:bg-[#0A0A0C]/95 backdrop-blur-md border-b border-[#EEEDF2] dark:border-neutral-800 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {/* Time Filter Pills */}
            <div className="flex items-center gap-1.5 shrink-0 bg-white dark:bg-neutral-900 p-1 rounded-full border border-[#DBDAE3] dark:border-neutral-800 shadow-xs">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTimeFilter(opt.value)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                    timeFilter === opt.value
                      ? 'bg-[#1E0A3C] text-white dark:bg-[#F05537] shadow-xs'
                      : 'text-[#6F7287] dark:text-neutral-400 hover:text-[#1E0A3C] dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Price Filter Pills */}
            <div className="flex items-center gap-1.5 shrink-0 bg-white dark:bg-neutral-900 p-1 rounded-full border border-[#DBDAE3] dark:border-neutral-800 shadow-xs">
              {PRICE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPriceFilter(opt.value)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                    priceFilter === opt.value
                      ? 'bg-[#1E0A3C] text-white dark:bg-[#F05537] shadow-xs'
                      : 'text-[#6F7287] dark:text-neutral-400 hover:text-[#1E0A3C] dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-xs font-bold text-[#F05537] hover:underline shrink-0 px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <span className="text-xs font-bold text-[#6F7287] dark:text-neutral-400">
              <strong className="text-[#1E0A3C] dark:text-white">{totalCount}</strong> events found
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-[#DBDAE3] dark:border-neutral-800 rounded-full px-3 py-1 text-xs font-semibold text-[#1E0A3C] dark:text-neutral-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#6F7287]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-xs font-semibold text-[#1E0A3C] dark:text-neutral-200"
              >
                <option value="RELEVANCE">Most Relevant</option>
                <option value="DATE_ASC">Date: Soonest First</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="POPULAR">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
