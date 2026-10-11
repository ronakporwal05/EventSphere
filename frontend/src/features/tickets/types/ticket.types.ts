export type TicketStatus = 'VALID' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED';

export interface TicketItem {
  id: string;
  ticketCode: string;
  eventName: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketType: 'VIP All-Access' | 'General Delegate' | 'Virtual Pass' | 'Speaker Badge';
  price: number;
  status: TicketStatus;
  qrCodeData: string;
  issuedAt: string;
  checkInTime?: string;
  seatNumber?: string;
}

export interface TicketTierSummary {
  id: string;
  name: string;
  price: number;
  totalQuantity: number;
  soldQuantity: number;
  status: 'ACTIVE' | 'SOLD_OUT' | 'UNPUBLISHED';
}
