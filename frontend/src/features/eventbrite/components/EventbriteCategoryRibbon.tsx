'use client';

import React from 'react';
import {
  Music,
  Cpu,
  Briefcase,
  UtensilsCrossed,
  Palette,
  Zap,
  Dumbbell,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  bgLight: string;
  textColor: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'Music',
    name: 'Music & Concerts',
    icon: <Music className="w-5 h-5" />,
    bgLight: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    textColor: 'group-hover:text-rose-600',
  },
  {
    id: 'Technology & AI',
    name: 'Tech & AI Summits',
    icon: <Cpu className="w-5 h-5" />,
    bgLight: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900',
    textColor: 'group-hover:text-indigo-600',
  },
  {
    id: 'Business',
    name: 'Business & Founders',
    icon: <Briefcase className="w-5 h-5" />,
    bgLight: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900',
    textColor: 'group-hover:text-blue-600',
  },
  {
    id: 'Food & Drink',
    name: 'Food & Nightlife',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    bgLight: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    textColor: 'group-hover:text-amber-600',
  },
  {
    id: 'Arts & Culture',
    name: 'Arts & Exhibitions',
    icon: <Palette className="w-5 h-5" />,
    bgLight: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-900',
    textColor: 'group-hover:text-purple-600',
  },
  {
    id: 'Hackathons',
    name: 'Hackathons & Pitches',
    icon: <Zap className="w-5 h-5" />,
    bgLight: 'bg-orange-50 text-[#F05537] dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-900',
    textColor: 'group-hover:text-[#F05537]',
  },
  {
    id: 'Sports & Fitness',
    name: 'Sports & Fitness',
    icon: <Dumbbell className="w-5 h-5" />,
    bgLight: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    textColor: 'group-hover:text-emerald-600',
  },
  {
    id: 'Workshops',
    name: 'Workshops & Classes',
    icon: <GraduationCap className="w-5 h-5" />,
    bgLight: 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 border-teal-200 dark:border-teal-900',
    textColor: 'group-hover:text-teal-600',
  },
];

interface EventbriteCategoryRibbonProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const EventbriteCategoryRibbon: React.FC<EventbriteCategoryRibbonProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="bg-white dark:bg-[#111114] border-b border-[#EEEDF2] dark:border-neutral-800 py-6 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-[#1E0A3C] dark:text-white">
            Explore Categories
          </h2>
          <span className="text-xs font-semibold text-[#6F7287] dark:text-neutral-400">
            Swipe or click to filter
          </span>
        </div>

        {/* Horizontal Category Circles */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'ALL' : cat.id)}
                className="group flex flex-col items-center gap-2 shrink-0 min-w-[80px] sm:min-w-[90px] focus:outline-none transition-transform active:scale-95"
              >
                {/* Circle Icon Button */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#F05537] text-white border-[#F05537] shadow-lg shadow-[#F05537]/30 scale-105 ring-4 ring-[#F05537]/20'
                      : `${cat.bgLight} hover:scale-105 shadow-xs`
                  }`}
                >
                  {cat.icon}
                </div>

                {/* Category Label */}
                <span
                  className={`text-xs font-bold text-center leading-tight transition-colors line-clamp-1 ${
                    isSelected
                      ? 'text-[#F05537]'
                      : 'text-[#1E0A3C] dark:text-neutral-200 group-hover:text-[#F05537]'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
