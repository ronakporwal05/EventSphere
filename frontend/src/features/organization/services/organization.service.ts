import { apiClient } from '@/lib/api-client';
import { OrganizationDetails, OrganizationMember, Department, InviteMemberInput } from '../types/organization.types';
import { OrganizationProfileInput, BrandingInput } from '../validation/organization.schema';

export const organizationService = {
  getOrganization: async (): Promise<OrganizationDetails> => {
    try {
      const response = await apiClient.get('/organization/me');
      return response.data.data;
    } catch {
      return {
        id: 'org-default',
        name: 'EventSphere Enterprise Corp',
        slug: 'eventsphere-enterprise',
        description: 'Global leader in AI-augmented multi-tenant event management.',
        contactEmail: 'admin@eventsphere.ai',
        website: 'https://eventsphere.ai',
        logoUrl: '',
        primaryColor: '#4f46e5',
        secondaryColor: '#9333ea',
        customDomain: 'events.enterprise.com',
        createdAt: '2026-01-15T00:00:00Z',
      };
    }
  },

  updateOrganization: async (input: OrganizationProfileInput): Promise<OrganizationDetails> => {
    const response = await apiClient.put('/organization/me', input);
    return response.data.data;
  },

  updateBranding: async (input: BrandingInput): Promise<OrganizationDetails> => {
    const response = await apiClient.put('/organization/branding', input);
    return response.data.data;
  },

  getMembers: async (): Promise<OrganizationMember[]> => {
    try {
      const response = await apiClient.get('/organization/members');
      return response.data.data;
    } catch {
      return [
        {
          id: 'mem-1',
          userId: 'usr-1',
          name: 'Alexander Wright',
          email: 'alex.w@enterprise.com',
          role: 'ORGANIZATION_ADMIN',
          department: 'Executive Leadership',
          status: 'ACTIVE',
          joinedAt: '2026-01-15',
        },
        {
          id: 'mem-2',
          userId: 'usr-2',
          name: 'Sophia Martinez',
          email: 'sophia.m@enterprise.com',
          role: 'EVENT_MANAGER',
          department: 'Event Operations',
          status: 'ACTIVE',
          joinedAt: '2026-02-01',
        },
        {
          id: 'mem-3',
          userId: 'usr-3',
          name: 'David Kim',
          email: 'david.k@enterprise.com',
          role: 'STAFF',
          department: 'Marketing & PR',
          status: 'INVITED',
          joinedAt: '2026-03-10',
        },
      ];
    }
  },

  inviteMember: async (input: InviteMemberInput): Promise<OrganizationMember> => {
    const response = await apiClient.post('/organization/members/invite', input);
    return response.data.data;
  },

  getDepartments: async (): Promise<Department[]> => {
    return [
      { id: 'dept-1', name: 'Executive Leadership', description: 'Overall tenant administration and governance', memberCount: 3 },
      { id: 'dept-2', name: 'Event Operations', description: 'On-site logistics, schedule management, and scanner check-ins', memberCount: 12 },
      { id: 'dept-3', name: 'Marketing & PR', description: 'Promotional copys, AI content studio, and campaign management', memberCount: 8 },
      { id: 'dept-4', name: 'Technical Support', description: 'RAG knowledge base oversight and IT infrastructure', memberCount: 5 },
      { id: 'dept-5', name: 'Volunteer Operations', description: 'Volunteer shift assignment and leaderboard tracking', memberCount: 25 },
    ];
  },
};
