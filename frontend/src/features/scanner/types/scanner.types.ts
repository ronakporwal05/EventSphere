export type ScanResultType = 'SUCCESS' | 'ALREADY_REDEEMED' | 'INVALID' | 'EXPIRED';

export interface ScanResult {
  type: ScanResultType;
  message: string;
  ticketCode?: string;
  attendeeName?: string;
  ticketType?: string;
  scannedAt: string;
}

export interface TelemetryStats {
  totalScanned: number;
  entryRatePerMinute: number;
  recentScans: ScanResult[];
}
