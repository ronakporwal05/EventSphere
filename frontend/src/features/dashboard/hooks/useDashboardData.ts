import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export const useDashboardData = () => {
  const metricsQuery = useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: dashboardService.getMetrics,
    refetchInterval: 30000, // Auto-refresh metrics every 30s
  });

  const activitiesQuery = useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: dashboardService.getRecentActivities,
    refetchInterval: 15000, // Refresh activity stream every 15s
  });

  const attendanceQuery = useQuery({
    queryKey: ['dashboard', 'attendance-timeline'],
    queryFn: dashboardService.getAttendanceTimeline,
  });

  return {
    metrics: metricsQuery.data,
    activities: activitiesQuery.data || [],
    attendanceData: attendanceQuery.data || [],
    isLoading: metricsQuery.isLoading || activitiesQuery.isLoading,
    isError: metricsQuery.isError,
    refetchAll: () => {
      metricsQuery.refetch();
      activitiesQuery.refetch();
      attendanceQuery.refetch();
    },
  };
};
