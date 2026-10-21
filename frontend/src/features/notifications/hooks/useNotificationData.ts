import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';
import { toast } from 'sonner';

export const useNotificationData = () => {
  const queryClient = useQueryClient();

  const notifQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotificationData,
  });

  const dispatchMutation = useMutation({
    mutationFn: ({ templateId, channel }: { templateId: string; channel: string }) =>
      notificationService.dispatchCampaign(templateId, channel),
    onSuccess: () => {
      toast.success('Notification campaign dispatched successfully!');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const readMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    templates: notifQuery.data?.templates || [],
    inAppNotifications: notifQuery.data?.inAppNotifications || [],
    stats: notifQuery.data?.stats || { totalSent: 0, delivered: 0, bounced: 0, openRatePercentage: 0 },
    isLoading: notifQuery.isLoading,
    dispatch: dispatchMutation.mutate,
    isDispatching: dispatchMutation.isPending,
    markAsRead: readMutation.mutate,
  };
};
