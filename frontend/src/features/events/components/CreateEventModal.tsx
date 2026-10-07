'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEventSchema, CreateEventFormInput } from '../validation/event.schema';
import { CalendarDays, X, Loader2, MapPin, Globe, Users } from 'lucide-react';
import { CreateEventInput } from '../types/event.types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: CreateEventInput) => void;
  isCreating: boolean;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateEventFormInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Technology & AI',
      startDate: '2026-10-15T09:00',
      endDate: '2026-10-16T18:00',
      location: 'Convention Center, SF',
      isVirtual: true,
      virtualLink: 'https://stream.eventsphere.ai/live',
      capacity: 1000,
    },
  });

  const isVirtual = watch('isVirtual');

  if (!isOpen) return null;

  const onSubmit = (data: CreateEventFormInput) => {
    onCreate({
      ...data,
      tags: ['Enterprise', data.category],
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Create Enterprise Event</h3>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Event Title
            </label>
            <input
              {...register('title')}
              placeholder="e.g. AI Summit 2026 Keynote"
              className="w-full px-3.5 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Event Category
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Technology & AI">Technology & AI</option>
              <option value="Developer Workshop">Developer Workshop</option>
              <option value="Executive Forum">Executive Forum</option>
              <option value="Product Launch">Product Launch</option>
              <option value="Networking Gala">Networking Gala</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Provide a compelling overview for attendees..."
              className="w-full px-3.5 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                {...register('startDate')}
                className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                {...register('endDate')}
                className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Venue Location
              </label>
              <input
                {...register('location')}
                placeholder="Grand Hall, San Francisco"
                className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Maximum Capacity
              </label>
              <input
                type="number"
                {...register('capacity', { valueAsNumber: true })}
                className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer text-xs text-neutral-300">
              <input
                type="checkbox"
                {...register('isVirtual')}
                className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-indigo-600"
              />
              <span>Enable Hybrid / Virtual Streaming</span>
            </label>

            {isVirtual && (
              <div>
                <label className="block text-[10px] text-neutral-400 mb-1">Live Broadcast URL</label>
                <input
                  {...register('virtualLink')}
                  placeholder="https://stream.eventsphere.ai/live"
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5"
            >
              {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Event Draft</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
