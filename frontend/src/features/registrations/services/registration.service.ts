import { apiClient } from '@/lib/api-client';
import { AttendeeRegistration, RegistrationMetrics, CustomFormField } from '../types/registration.types';

export const registrationService = {
  getRegistrations: async (eventId?: string): Promise<{ items: AttendeeRegistration[]; metrics: RegistrationMetrics }> => {
    try {
      const response = await apiClient.get('/registrations', { params: { eventId } });
      return response.data.data;
    } catch {
      // Mock data fallback
      const items: AttendeeRegistration[] = [
        {
          id: 'reg-1',
          eventId: 'evt-101',
          eventTitle: 'EventSphere AI Global Keynote 2026',
          attendeeName: 'Dr. Sarah Jenkins',
          attendeeEmail: 'sarah.j@enterprise.com',
          ticketType: 'VIP Pass',
          status: 'CHECKED_IN',
          registeredAt: '2026-08-01 10:14:00',
          company: 'Acme Enterprise',
          jobTitle: 'VP Engineering',
        },
        {
          id: 'reg-2',
          eventId: 'evt-101',
          eventTitle: 'EventSphere AI Global Keynote 2026',
          attendeeName: 'Michael Chen',
          attendeeEmail: 'mchen@techcorp.com',
          ticketType: 'General Delegate',
          status: 'PENDING',
          registeredAt: '2026-08-04 14:22:00',
          company: 'TechCorp',
          jobTitle: 'Principal Architect',
        },
        {
          id: 'reg-3',
          eventId: 'evt-101',
          eventTitle: 'EventSphere AI Global Keynote 2026',
          attendeeName: 'Emily Watson',
          attendeeEmail: 'emily.w@innovate.io',
          ticketType: 'Virtual Streamer',
          status: 'WAITLISTED',
          registeredAt: '2026-08-05 09:05:00',
          company: 'Innovate Labs',
          jobTitle: 'Product Lead',
        },
        {
          id: 'reg-4',
          eventId: 'evt-102',
          eventTitle: 'DevCon Tech Summit Spring 2026',
          attendeeName: 'Carlos Rossi',
          attendeeEmail: 'carlos.r@dev.org',
          ticketType: 'Developer Pass',
          status: 'APPROVED',
          registeredAt: '2026-08-02 11:45:00',
          company: 'OpenDev',
          jobTitle: 'DevOps Specialist',
        },
      ];

      return {
        items,
        metrics: {
          totalRegistrations: 12840,
          pendingApprovals: 42,
          waitlisted: 18,
          checkedIn: 3420,
        },
      };
    }
  },

  approveRegistration: async (id: string): Promise<void> => {
    await apiClient.post(`/registrations/${id}/approve`);
  },

  rejectRegistration: async (id: string): Promise<void> => {
    await apiClient.post(`/registrations/${id}/reject`);
  },

  promoteWaitlist: async (id: string): Promise<void> => {
    await apiClient.post(`/registrations/${id}/promote`);
  },

  exportRegistrationsCSV: async (): Promise<void> => {
    const res = await apiClient.get('/registrations/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'attendee-registrations.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
