import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/event.service';
import { EventQueryParams, CreateEventInput } from '../types/event.types';
import { toast } from 'sonner';

export const useEventData = () => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<EventQueryParams>({
    search: '',
    category: 'ALL',
    status: 'ALL',
    page: 1,
    limit: 10,
  });

  const eventsQuery = useQuery({
    queryKey: ['events', params],
    queryFn: () => eventService.getEvents(params),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateEventInput) => eventService.createEvent(input),
    onSuccess: () => {
      toast.success('Event created successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create event.');
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => eventService.publishEvent(id),
    onSuccess: () => {
      toast.success('Event published to portal!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => eventService.archiveEvent(id),
    onSuccess: () => {
      toast.success('Event archived.');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const cloneMutation = useMutation({
    mutationFn: (id: string) => eventService.cloneEvent(id),
    onSuccess: () => {
      toast.success('Event cloned successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    events: eventsQuery.data?.events || [],
    total: eventsQuery.data?.total || 0,
    isLoading: eventsQuery.isLoading,
    params,
    setParams,
    createEvent: createMutation.mutate,
    isCreating: createMutation.isPending,
    publishEvent: publishMutation.mutate,
    archiveEvent: archiveMutation.mutate,
    cloneEvent: cloneMutation.mutate,
  };
};
