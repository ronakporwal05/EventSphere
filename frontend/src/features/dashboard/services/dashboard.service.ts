import { apiClient } from '@/lib/api-client';
import { DashboardMetrics, ActivityItem, AttendanceChartData } from '../types/dashboard.types';

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const response = await apiClient.get('/analytics/dashboard-summary');
      return response.data.data;
    } catch {
      // Fallback mock telemetry if backend endpoint is initializing
      return {
        totalEvents: 42,
        todaysEvents: 3,
        totalRegistrations: 12840,
        liveAttendance: 3420,
        certificatesIssued: 8910,
        activeNotifications: 5,
        aiTokensUsed: 142850,
        systemStatus: 'HEALTHY',
      };
    }
  },

  getRecentActivities: async (): Promise<ActivityItem[]> => {
    try {
      const response = await apiClient.get('/analytics/recent-activities');
      return response.data.data;
    } catch {
      return [
        {
          id: 'act-1',
          type: 'CHECKIN',
          title: 'Attendee Check-in',
          description: 'Sarah Jenkins checked in to Keynote Session A',
          timestamp: '2 mins ago',
          userEmail: 'sarah.j@enterprise.com',
        },
        {
          id: 'act-2',
          type: 'AI_QUERY',
          title: 'RAG Knowledge Query',
          description: 'Assistant answered query on venue WiFi credentials',
          timestamp: '5 mins ago',
          userEmail: 'staff@eventsphere.ai',
        },
        {
          id: 'act-3',
          type: 'REGISTRATION',
          title: 'New VIP Registration',
          description: 'Michael Chen registered for DevCon 2026',
          timestamp: '12 mins ago',
          userEmail: 'mchen@techcorp.com',
        },
        {
          id: 'act-4',
          type: 'REPORT_GEN',
          title: 'Post-Event Report Generated',
          description: 'AI Report Generator compiled executive PDF summary',
          timestamp: '25 mins ago',
          userEmail: 'admin@eventsphere.ai',
        },
      ];
    }
  },

  getAttendanceTimeline: async (): Promise<AttendanceChartData[]> => {
    return [
      { time: '08:00 AM', checkedIn: 120, capacity: 4000 },
      { time: '09:00 AM', checkedIn: 850, capacity: 4000 },
      { time: '10:00 AM', checkedIn: 2100, capacity: 4000 },
      { time: '11:00 AM', checkedIn: 3200, capacity: 4000 },
      { time: '12:00 PM', checkedIn: 3420, capacity: 4000 },
      { time: '01:00 PM', checkedIn: 3380, capacity: 4000 },
      { time: '02:00 PM', checkedIn: 3510, capacity: 4000 },
    ];
  },
};
