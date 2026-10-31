import { EventbriteCardData } from '@/features/eventbrite/components/EventbriteCard';
import { getCurrentCalendarWindow } from '@/lib/calendar-utils';

const calendar = getCurrentCalendarWindow();

export const FLAGSHIP_EVENT: EventbriteCardData = {
  id: 'evt-global-2026',
  title: 'Innovators Connect Live 2026: Multi-Tenant AI & Cloud Summit',
  description: 'The premier global summit for AI architectures, multi-tenant engineering, and distributed scale.',
  category: 'CONFERENCE',
  startDate: calendar.flagshipDateText,
  location: 'ExCeL London Arena, Royal Victoria Dock, London',
  city: 'London',
  venueName: 'ExCeL London Arena',
  imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  price: 99,
  formattedPrice: '$99.00',
  capacity: 2500,
  registeredCount: 2180,
  organizerName: 'Event Sphere AI Global',
  badge: `★ FLAGSHIP ${calendar.currentYear}`,
  hasSeatMap: true,
  isVirtual: false,
};
