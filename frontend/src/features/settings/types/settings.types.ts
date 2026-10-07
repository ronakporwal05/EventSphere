export interface SystemSettingsConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  stripePublicKey: string;
  stripeSecretKey: string;
  webhookSecret: string;
  enforceMfa: boolean;
  sessionTimeoutMinutes: number;
}

export interface SecurityAuditLog {
  id: string;
  actorName: string;
  action: string;
  ipAddress: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}
