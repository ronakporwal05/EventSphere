import { z } from 'zod';

export const editUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['SYSTEM_ADMIN', 'ORGANIZATION_ADMIN', 'EVENT_MANAGER', 'STAFF', 'ATTENDEE', 'VOLUNTEER']),
  department: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']),
});

export type EditUserFormInput = z.infer<typeof editUserSchema>;
