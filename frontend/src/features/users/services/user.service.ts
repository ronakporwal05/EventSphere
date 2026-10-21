import { apiClient } from '@/lib/api-client';
import { UserItem, UserQueryParams, UserListResponse, EditUserInput } from '../types/user.types';

export const userService = {
  getUsers: async (params: UserQueryParams): Promise<UserListResponse> => {
    try {
      const response = await apiClient.get('/users', { params });
      return response.data.data;
    } catch {
      // Mock data fallback
      const mockUsers: UserItem[] = [
        {
          id: 'usr-101',
          firstName: 'Sarah',
          lastName: 'Jenkins',
          email: 'sarah.j@enterprise.com',
          role: 'ORGANIZATION_ADMIN',
          tenantId: 'tenant-enterprise',
          status: 'ACTIVE',
          emailVerified: true,
          department: 'Executive Leadership',
          createdAt: '2026-01-10',
          lastLoginAt: '2026-08-05T20:15:00Z',
        },
        {
          id: 'usr-102',
          firstName: 'Marcus',
          lastName: 'Vance',
          email: 'marcus.v@enterprise.com',
          role: 'EVENT_MANAGER',
          tenantId: 'tenant-enterprise',
          status: 'ACTIVE',
          emailVerified: true,
          department: 'Event Operations',
          createdAt: '2026-02-14',
          lastLoginAt: '2026-08-05T18:30:00Z',
        },
        {
          id: 'usr-103',
          firstName: 'Elena',
          lastName: 'Rostova',
          email: 'elena.r@enterprise.com',
          role: 'STAFF',
          tenantId: 'tenant-enterprise',
          status: 'ACTIVE',
          emailVerified: true,
          department: 'Marketing & PR',
          createdAt: '2026-03-01',
          lastLoginAt: '2026-08-04T14:10:00Z',
        },
        {
          id: 'usr-104',
          firstName: 'Jason',
          lastName: 'Tate',
          email: 'jason.t@enterprise.com',
          role: 'VOLUNTEER',
          tenantId: 'tenant-enterprise',
          status: 'PENDING',
          emailVerified: false,
          department: 'Volunteer Operations',
          createdAt: '2026-07-20',
        },
        {
          id: 'usr-105',
          firstName: 'Amanda',
          lastName: 'Bowers',
          email: 'amanda.b@enterprise.com',
          role: 'ATTENDEE',
          tenantId: 'tenant-enterprise',
          status: 'INACTIVE',
          emailVerified: true,
          createdAt: '2026-05-11',
        },
      ];

      let filtered = [...mockUsers];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.firstName.toLowerCase().includes(q) ||
            u.lastName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        );
      }
      if (params.role && params.role !== 'ALL') {
        filtered = filtered.filter((u) => u.role === params.role);
      }
      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter((u) => u.status === params.status);
      }

      return {
        users: filtered,
        total: filtered.length,
        page: params.page || 1,
        totalPages: 1,
      };
    }
  },

  updateUser: async (userId: string, input: EditUserInput): Promise<UserItem> => {
    const response = await apiClient.put(`/users/${userId}`, input);
    return response.data.data;
  },

  toggleUserStatus: async (userId: string, currentStatus: string): Promise<void> => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await apiClient.patch(`/users/${userId}/status`, { status: newStatus });
  },

  uploadAvatar: async (userId: string, file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/users/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
