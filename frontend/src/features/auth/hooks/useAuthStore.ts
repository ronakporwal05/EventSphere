import { create } from 'zustand';
import { UserProfile } from '../types/auth.types';
import { HIERARCHICAL_ACCOUNTS, HierarchyRoleType } from '../utils/hierarchy';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserProfile, token: string, refreshToken?: string) => void;
  loginAsRole: (role: Exclude<HierarchyRoleType, 'GUEST'>) => UserProfile;
  clearAuth: () => void;
  setUser: (user: UserProfile) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('tenant_id', user.tenantId || 'tenant-default');
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  loginAsRole: (role) => {
    const account = HIERARCHICAL_ACCOUNTS[role];
    const user: UserProfile = {
      id: `usr-${role.toLowerCase()}-active`,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      role: account.role,
      tenantId: 'tenant-default',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    const token = `mock-jwt-${role.toLowerCase()}-session-2026`;

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', `mock-refresh-${role.toLowerCase()}-2026`);
      localStorage.setItem('tenant_id', 'tenant-default');
      localStorage.setItem('user', JSON.stringify(user));
    }

    set({ user, token, isAuthenticated: true, isLoading: false });
    return user;
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user });
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return;
        } catch {
          // Invalid stored JSON
        }
      }
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
