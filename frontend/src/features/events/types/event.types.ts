export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'ARCHIVED' | 'CANCELLED';

export interface Session {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  room?: string;
  speakerName?: string;
  speakerRole?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: EventStatus;
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  capacity: number;
  registeredCount: number;
  currentAttendees?: number;
  bannerUrl?: string;
  coverImageUrl?: string;
  ticketTiers?: Array<{ name: string; price: number; available?: number }>;
  organizerName: string;
  sessions?: Session[];
  tags: string[];
  createdAt: string;
}

export interface EventQueryParams {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateEventInput {
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  capacity: number;
  tags: string[];
}
