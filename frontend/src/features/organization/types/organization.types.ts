import { UserRole } from '@/features/auth/types/auth.types';

export interface OrganizationDetails {
  id: string;
  name: string;
  slug: string;
  description?: string;
  contactEmail: string;
  website?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  customDomain?: string;
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'ACTIVE' | 'INVITED' | 'DEACTIVATED';
  joinedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

export interface InviteMemberInput {
  email: string;
  role: UserRole;
  department: string;
}
