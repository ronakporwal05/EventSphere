export interface DashboardMetrics {
  totalEvents: number;
  todaysEvents: number;
  totalRegistrations: number;
  liveAttendance: number;
  certificatesIssued: number;
  activeNotifications: number;
  aiTokensUsed: number;
  systemStatus: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
}

export interface ActivityItem {
  id: string;
  type: 'REGISTRATION' | 'CHECKIN' | 'AI_QUERY' | 'REPORT_GEN' | 'EVENT_CREATED';
  title: string;
  description: string;
  timestamp: string;
  userEmail?: string;
}

export interface AttendanceChartData {
  time: string;
  checkedIn: number;
  capacity: number;
}
