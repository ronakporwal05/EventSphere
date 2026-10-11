import { apiClient } from '@/lib/api-client';
import { TicketItem, TicketTierSummary } from '../types/ticket.types';

export const ticketService = {
  getTickets: async (): Promise<{ tickets: TicketItem[]; tiers: TicketTierSummary[] }> => {
    try {
      const response = await apiClient.get('/tickets');
      return response.data.data;
    } catch {
      // Mock fallback data
      const tickets: TicketItem[] = [
        {
          id: 'tkt-001',
          ticketCode: 'TKT-AI-2026-VIP-9941',
          eventName: 'EventSphere AI Global Keynote 2026',
          attendeeName: 'Dr. Sarah Jenkins',
          attendeeEmail: 'sarah.j@enterprise.com',
          ticketType: 'VIP All-Access',
          price: 499,
          status: 'REDEEMED',
          qrCodeData: 'ES-QR-VALID-9941-SARAH-JENKINS',
          issuedAt: '2026-08-01 10:14:00',
          checkInTime: '2026-09-15 08:45:12',
          seatNumber: 'A-12',
        },
        {
          id: 'tkt-002',
          ticketCode: 'TKT-AI-2026-GEN-8832',
          eventName: 'EventSphere AI Global Keynote 2026',
          attendeeName: 'Michael Chen',
          attendeeEmail: 'mchen@techcorp.com',
          ticketType: 'General Delegate',
          price: 199,
          status: 'VALID',
          qrCodeData: 'ES-QR-VALID-8832-MICHAEL-CHEN',
          issuedAt: '2026-08-04 14:22:00',
          seatNumber: 'C-44',
        },
        {
          id: 'tkt-003',
          ticketCode: 'TKT-DEV-2026-SPK-1042',
          eventName: 'DevCon Tech Summit Spring 2026',
          attendeeName: 'Carlos Rossi',
          attendeeEmail: 'carlos.r@dev.org',
          ticketType: 'Speaker Badge',
          price: 0,
          status: 'VALID',
          qrCodeData: 'ES-QR-VALID-1042-CARLOS-ROSSI',
          issuedAt: '2026-08-02 11:45:00',
        },
      ];

      const tiers: TicketTierSummary[] = [
        { id: 'tier-1', name: 'VIP All-Access Pass', price: 499, totalQuantity: 250, soldQuantity: 250, status: 'SOLD_OUT' },
        { id: 'tier-2', name: 'General Delegate Pass', price: 199, totalQuantity: 3500, soldQuantity: 2410, status: 'ACTIVE' },
        { id: 'tier-3', name: 'Virtual Streaming Pass', price: 49, totalQuantity: 10000, soldQuantity: 4120, status: 'ACTIVE' },
        { id: 'tier-4', name: 'Speaker & Staff Badge', price: 0, totalQuantity: 100, soldQuantity: 42, status: 'ACTIVE' },
      ];

      return { tickets, tiers };
    }
  },

  regenerateTicketQR: async (ticketId: string): Promise<TicketItem> => {
    const response = await apiClient.post(`/tickets/${ticketId}/regenerate`);
    return response.data.data;
  },

  downloadTicketPDF: async (ticketCode: string): Promise<void> => {
    const response = await apiClient.get(`/tickets/${ticketCode}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ticketCode}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  verifyTicketCode: async (ticketCode: string): Promise<{ valid: boolean; ticket?: TicketItem }> => {
    const response = await apiClient.post('/tickets/verify', { ticketCode });
    return response.data.data;
  },
};
