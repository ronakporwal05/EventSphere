import { apiClient } from '@/lib/api-client';
import { ScanResult } from '../types/scanner.types';

export const scannerService = {
  processScan: async (ticketCode: string): Promise<ScanResult> => {
    try {
      const response = await apiClient.post('/scanner/check-in', { ticketCode });
      return response.data.data;
    } catch (err: any) {
      // Mock validation logic fallback
      const now = new Date().toLocaleTimeString();
      if (ticketCode.includes('DUPLICATE')) {
        return {
          type: 'ALREADY_REDEEMED',
          message: 'TICKET ALREADY REDEEMED! Entry denied.',
          ticketCode,
          attendeeName: 'Duplicate Scanned User',
          ticketType: 'General Pass',
          scannedAt: now,
        };
      }
      if (ticketCode.includes('INVALID') || ticketCode.length < 5) {
        return {
          type: 'INVALID',
          message: 'INVALID BARCODE SIGNATURE! Fake or corrupted badge.',
          ticketCode,
          scannedAt: now,
        };
      }
      return {
        type: 'SUCCESS',
        message: 'CHECK-IN VERIFIED! Welcome to EventSphere AI.',
        ticketCode,
        attendeeName: 'Dr. Sarah Jenkins',
        ticketType: 'VIP All-Access',
        scannedAt: now,
      };
    }
  },
};
