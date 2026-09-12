'use client';

import React, { useState } from 'react';
import { useEventData } from '@/features/events/hooks/useEventData';
import { EventFilterBar } from '@/features/events/components/EventFilterBar';
import { EventCardGrid } from '@/features/events/components/EventCardGrid';
import { CreateEventModal } from '@/features/events/components/CreateEventModal';
import { CalendarDays, Plus, Loader2 } from 'lucide-react';

export default function EventsListPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isAiVibeMode, setIsAiVibeMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    events,
    total,
    isLoading,
    params,
    setParams,
    createEvent,
    isCreating,
    publishEvent,
    archiveEvent,
    cloneEvent,
  } = useEventData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Event Management Studio</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Create, schedule, publish, and manage enterprise events & sessions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Filter Bar */}
      <EventFilterBar
        params={params}
        setParams={setParams}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isAiVibeMode={isAiVibeMode}
        setIsAiVibeMode={setIsAiVibeMode}
      />

      {/* Grid Content */}
      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center min-h-[40vh] space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-neutral-400 font-medium">Loading Events Catalog...</p>
        </div>
      ) : (
        <EventCardGrid
          events={events}
          onPublish={publishEvent}
          onArchive={archiveEvent}
          onClone={cloneEvent}
        />
      )}

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createEvent}
        isCreating={isCreating}
      />
    </div>
  );
}
