export type NotificationChannel = 'EMAIL' | 'SMS' | 'IN_APP' | 'PUSH';

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: NotificationChannel;
  subject?: string;
  body: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'SYSTEM' | 'EVENT' | 'SECURITY';
}

export interface CampaignDeliveryStats {
  totalSent: number;
  delivered: number;
  bounced: number;
  openRatePercentage: number;
}
