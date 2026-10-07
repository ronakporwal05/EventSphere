import { apiClient } from '@/lib/api-client';
import { Volunteer, VolunteerAuditActivity, VolunteerShiftStatus } from '../types/volunteer.types';

export const volunteerService = {
  getVolunteers: async (): Promise<{ volunteers: Volunteer[]; logs: VolunteerAuditActivity[] }> => {
    try {
      const response = await apiClient.get('/volunteers');
      return response.data.data;
    } catch {
      const volunteers: Volunteer[] = [
        {
          id: 'vol-1',
          name: 'Alex Rivera',
          email: 'alex.r@volunteer.org',
          phone: '+1 (555) 234-5678',
          assignedZone: 'Main Entrance Turnstile A',
          shiftTime: '08:00 AM - 02:00 PM',
          status: 'ON_SHIFT',
          scansProcessed: 842,
        },
        {
          id: 'vol-2',
          name: 'Samantha Lee',
          email: 'sam.lee@volunteer.org',
          phone: '+1 (555) 876-5432',
          assignedZone: 'VIP Lounge Gate B',
          shiftTime: '08:00 AM - 02:00 PM',
          status: 'ON_BREAK',
          scansProcessed: 410,
        },
        {
          id: 'vol-3',
          name: 'Jordan Taylor',
          email: 'j.taylor@volunteer.org',
          phone: '+1 (555) 998-1122',
          assignedZone: 'Virtual Stream Control Desk',
          shiftTime: '02:00 PM - 08:00 PM',
          status: 'OFF_SHIFT',
          scansProcessed: 0,
        },
      ];

      const logs: VolunteerAuditActivity[] = [
        { id: 'log-1', volunteerName: 'Alex Rivera', action: 'Scanned Ticket TKT-AI-2026-VIP-9941', timestamp: '10:14:02 AM', zone: 'Main Entrance Turnstile A' },
        { id: 'log-2', volunteerName: 'Samantha Lee', action: 'Toggled Shift Status to ON_BREAK', timestamp: '10:00:15 AM', zone: 'VIP Lounge Gate B' },
        { id: 'log-3', volunteerName: 'Alex Rivera', action: 'Resolved Duplicate Badge Warning', timestamp: '09:42:10 AM', zone: 'Main Entrance Turnstile A' },
      ];

      return { volunteers, logs };
    }
  },

  updateShiftStatus: async (volunteerId: string, status: VolunteerShiftStatus): Promise<void> => {
    await apiClient.patch(`/volunteers/${volunteerId}/status`, { status });
  },

  broadcastEmergencyAlert: async (message: string): Promise<void> => {
    await apiClient.post('/volunteers/broadcast', { message });
  },
};
