import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';

export const useAnalyticsData = () => {
  const analyticsQuery = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getAnalyticsOverview,
  });

  return {
    data: analyticsQuery.data,
    isLoading: analyticsQuery.isLoading,
    exportExecutiveSummary: analyticsService.exportExecutiveSummaryReport,
  };
};
