import { UserRole } from '@/features/auth/types/auth.types';

export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  tenantId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  emailVerified: boolean;
  avatarUrl?: string;
  department?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserQueryParams {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResponse {
  users: UserItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface EditUserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}
