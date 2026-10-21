import { apiClient } from '@/lib/api-client';
import { NotificationTemplate, InAppNotification, CampaignDeliveryStats } from '../types/notification.types';

export const notificationService = {
  getNotificationData: async (): Promise<{
    templates: NotificationTemplate[];
    inAppNotifications: InAppNotification[];
    stats: CampaignDeliveryStats;
  }> => {
    try {
      const response = await apiClient.get('/notifications');
      return response.data.data;
    } catch {
      const templates: NotificationTemplate[] = [
        {
          id: 'tmpl-1',
          name: 'Registration Confirmation Email',
          channel: 'EMAIL',
          subject: 'Your Badge for {{EVENT_NAME}} is Ready!',
          body: 'Dear {{ATTENDEE_NAME}},\n\nThank you for registering for {{EVENT_NAME}}. Your QR ticket pass is attached.',
        },
        {
          id: 'tmpl-2',
          name: 'Emergency Gate Shift SMS',
          channel: 'SMS',
          body: 'URGENT: {{ATTENDEE_NAME}}, please report to Turnstile Gate C for VIP entrance.',
        },
      ];

      const inAppNotifications: InAppNotification[] = [
        { id: 'notif-1', title: 'Check-in Threshold Alert', message: 'Venue capacity reached 80% at Main Entrance.', timestamp: '10 mins ago', read: false, category: 'EVENT' },
        { id: 'notif-2', title: 'Tenant SSL Auto-Renewed', message: 'Custom domain SSL certificate renewed for tenant.', timestamp: '1 hour ago', read: true, category: 'SYSTEM' },
      ];

      const stats: CampaignDeliveryStats = {
        totalSent: 14200,
        delivered: 13980,
        bounced: 220,
        openRatePercentage: 68.4,
      };

      return { templates, inAppNotifications, stats };
    }
  },

  dispatchCampaign: async (templateId: string, channel: string): Promise<void> => {
    await apiClient.post('/notifications/dispatch', { templateId, channel });
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },
};
