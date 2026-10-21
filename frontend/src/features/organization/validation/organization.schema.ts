import { z } from 'zod';

export const organizationProfileSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
  contactEmail: z.string().email('Please enter a valid email address'),
  website: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
});

export type OrganizationProfileInput = z.infer<typeof organizationProfileSchema>;

export const brandingSchema = z.object({
  primaryColor: z.string().min(4, 'Color code required'),
  secondaryColor: z.string().min(4, 'Color code required'),
  customDomain: z.string().optional(),
});

export type BrandingInput = z.infer<typeof brandingSchema>;

export const inviteMemberSchema = z.object({
  email: z.string().email('Please enter a valid work email'),
  role: z.enum(['SYSTEM_ADMIN', 'ORGANIZATION_ADMIN', 'EVENT_MANAGER', 'STAFF', 'ATTENDEE', 'VOLUNTEER']),
  department: z.string().min(1, 'Please select a department'),
});

export type InviteMemberFormInput = z.infer<typeof inviteMemberSchema>;
