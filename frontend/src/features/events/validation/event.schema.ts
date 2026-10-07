import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  startDate: z.string().min(1, 'Start date & time required'),
  endDate: z.string().min(1, 'End date & time required'),
  location: z.string().min(2, 'Venue location or address required'),
  isVirtual: z.boolean(),
  virtualLink: z.string().url('Please enter a valid stream URL').or(z.literal('')).optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1 attendee'),
  tags: z.array(z.string()).optional(),
});

export type CreateEventFormInput = z.infer<typeof createEventSchema>;
