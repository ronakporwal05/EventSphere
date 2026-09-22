export type UserRole = 'SYSTEM_ADMIN' | 'ORGANIZATION_ADMIN' | 'EVENT_MANAGER' | 'STAFF' | 'ATTENDEE' | 'VOLUNTEER';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthResponseData {
  token: string;
  refreshToken: string;
  user: UserProfile;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
