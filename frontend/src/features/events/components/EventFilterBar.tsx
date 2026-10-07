'use client';

import React from 'react';
import { Search, Sparkles, Filter, LayoutGrid, List } from 'lucide-react';
import { EventQueryParams } from '../types/event.types';

interface EventFilterBarProps {
  params: EventQueryParams;
  setParams: React.Dispatch<React.SetStateAction<EventQueryParams>>;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  isAiVibeMode?: boolean;
  setIsAiVibeMode?: (val: boolean) => void;
}

export const EventFilterBar: React.FC<EventFilterBarProps> = ({
  params,
  setParams,
  viewMode,
  setViewMode,
  isAiVibeMode = false,
  setIsAiVibeMode,
}) => {
  return (
    <div className="space-y-2">
      <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input with Vibe Matcher Toggle */}
        <div className="relative flex-1 w-full">
          {isAiVibeMode ? (
            <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 animate-pulse" />
          ) : (
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          )}
          <input
            value={params.search || ''}
            onChange={(e) => setParams((p) => ({ ...p, search: e.target.value }))}
            placeholder={
              isAiVibeMode
                ? "✨ Vibe Matcher: 'tech conference with intense networking and startup pitch vibe'..."
                : "Search events by title, description, tags..."
            }
            className={`w-full pl-10 pr-28 py-2 bg-neutral-950/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none transition-all ${
              isAiVibeMode
                ? 'border border-purple-500/50 shadow-sm shadow-purple-500/10 focus:border-purple-400'
                : 'border border-neutral-800 focus:border-indigo-500'
            }`}
          />
          {setIsAiVibeMode && (
            <button
              type="button"
              onClick={() => setIsAiVibeMode(!isAiVibeMode)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                isAiVibeMode
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                  : 'bg-neutral-800 text-neutral-400 hover:text-purple-300 hover:bg-neutral-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-300" />
              <span>AI Vibe</span>
            </button>
          )}
        </div>

        {/* Filter Options & View Toggle */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center space-x-1 px-2.5 py-1.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-neutral-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={params.status || 'ALL'}
              onChange={(e) => setParams((p) => ({ ...p, status: e.target.value }))}
              className="bg-transparent border-none text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-neutral-900">All Statuses</option>
              <option value="PUBLISHED" className="bg-neutral-900">Published</option>
              <option value="DRAFT" className="bg-neutral-900">Draft</option>
              <option value="COMPLETED" className="bg-neutral-900">Completed</option>
              <option value="ARCHIVED" className="bg-neutral-900">Archived</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 bg-neutral-950/60 p-1 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      {isAiVibeMode && (
        <div className="px-3 py-1.5 bg-purple-950/20 border border-purple-500/20 rounded-xl flex items-center justify-between text-[11px] text-purple-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Semantic Vector Discovery active. Querying Qdrant index with text-embedding-004...</span>
          </span>
          <span className="text-[10px] font-mono text-purple-400/80">768-dim</span>
        </div>
      )}
    </div>
  );
};
