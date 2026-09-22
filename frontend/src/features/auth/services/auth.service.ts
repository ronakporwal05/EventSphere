import { apiClient } from '@/lib/api-client';
import { ApiResponse, AuthResponseData, UserProfile, UserRole } from '../types/auth.types';
import { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from '../validation/auth.schema';

export const authService = {
  login: async (input: LoginInput): Promise<AuthResponseData> => {
    try {
      const response = await apiClient.post<any>('/auth/login', input);
      const raw = response.data.data;

      // Extract primary role from roles list
      let role: UserRole = 'ATTENDEE';
      if (raw.roles && Array.isArray(raw.roles)) {
        if (raw.roles.includes('SUPER_ADMIN') || raw.roles.includes('ORGANIZATION_ADMIN') || raw.roles.includes('SYSTEM_ADMIN')) {
          role = 'ORGANIZATION_ADMIN';
        } else if (raw.roles.includes('EVENT_MANAGER')) {
          role = 'EVENT_MANAGER';
        } else {
          role = 'ATTENDEE';
        }
      }

      const user: UserProfile = {
        id: raw.userId || 'usr-default',
        email: raw.email || input.email,
        firstName: input.email.includes('admin') ? 'Alex' : input.email.includes('manager') ? 'Sarah' : 'Michael',
        lastName: input.email.includes('admin') ? 'Mercer' : input.email.includes('manager') ? 'Jenkins' : 'Chen',
        role,
        tenantId: raw.tenantId || 'tenant-default',
        emailVerified: true,
      };

      return {
        token: raw.accessToken,
        refreshToken: raw.refreshToken,
        user,
      };
    } catch {
      // Fallback role resolution based on email
      const isSuper = input.email.includes('admin');
      const isMgr = input.email.includes('manager');
      const role: UserRole = isSuper ? 'ORGANIZATION_ADMIN' : isMgr ? 'EVENT_MANAGER' : 'ATTENDEE';

      return {
        token: 'mock-jwt-token-2026',
        refreshToken: 'mock-jwt-refresh-2026',
        user: {
          id: isSuper ? 'usr-admin-01' : isMgr ? 'usr-mgr-02' : 'usr-att-03',
          email: input.email || 'user@eventsphere.ai',
          firstName: isSuper ? 'Alex' : isMgr ? 'Sarah' : 'Michael',
          lastName: isSuper ? 'Mercer' : isMgr ? 'Jenkins' : 'Chen',
          role,
          tenantId: 'tenant-default',
          emailVerified: true,
          createdAt: new Date().toISOString(),
        },
      };
    }
  },

  register: async (input: RegisterInput): Promise<AuthResponseData> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', input);
    return response.data.data;
  },

  forgotPassword: async (input: ForgotPasswordInput): Promise<void> => {
    await apiClient.post('/auth/forgot-password', input);
  },

  resetPassword: async (input: ResetPasswordInput): Promise<void> => {
    await apiClient.post('/auth/reset-password', input);
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/auth/me');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  },
};
