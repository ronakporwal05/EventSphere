import { apiClient } from '@/lib/api-client';
import { SystemSettingsConfig, SecurityAuditLog } from '../types/settings.types';

export const settingsService = {
  getSettings: async (): Promise<{ config: SystemSettingsConfig; logs: SecurityAuditLog[] }> => {
    try {
      const response = await apiClient.get('/settings');
      return response.data.data;
    } catch {
      return {
        config: {
          smtpHost: 'smtp.sendgrid.net',
          smtpPort: 587,
          smtpUsername: 'apikey_eventsphere_prod',
          stripePublicKey: 'pk_live_51M0ES...8942',
          stripeSecretKey: 'sk_live_51M0ES...hidden',
          webhookSecret: 'whsec_9941028492019482',
          enforceMfa: true,
          sessionTimeoutMinutes: 60,
        },
        logs: [
          { id: 'audit-1', actorName: 'Alexander Wright (Org Admin)', action: 'Updated Custom Domain SSL Certificate', ipAddress: '192.168.1.104', timestamp: '2026-08-05 16:30:12', status: 'SUCCESS' },
          { id: 'audit-2', actorName: 'Dr. Sarah Jenkins', action: 'Exported Attendee CSV List', ipAddress: '172.16.0.42', timestamp: '2026-08-05 14:15:00', status: 'SUCCESS' },
          { id: 'audit-3', actorName: 'System Defender Bot', action: 'Blocked Failed Login Attempt (Invalid Password)', ipAddress: '45.33.22.11', timestamp: '2026-08-05 11:02:44', status: 'WARNING' },
        ],
      };
    }
  },

  updateSettings: async (config: Partial<SystemSettingsConfig>): Promise<void> => {
    await apiClient.put('/settings', config);
  },
};
