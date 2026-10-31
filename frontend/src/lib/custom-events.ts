export interface CustomEventItem {
  id: string;
  title: string;
  tagline: string;
  description?: string;
  category: string;
  eventType?: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID';
  city: string;
  venue: string;
  startDate: string;
  endDate?: string;
  dayBadge: string;
  monthBadge: string;
  price: number;
  vipPrice?: number;
  capacity: number;
  attendeesCount: number;
  imageUrl: string;
  createdAt: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  featured?: boolean;
  isCustom?: boolean;
}

const STORAGE_KEY = 'eventsphere_custom_events';

export const SEED_CUSTOM_EVENT: CustomEventItem = {
  id: 'evt-custom-seed-1',
  title: 'NextGen AI Agents & Multi-Tenant Summit 2026',
  tagline: 'Autonomous workflows, dynamic pricing, and decentralized event infrastructure.',
  description: 'Welcome to the NextGen AI Agents Summit. Join 1,500+ builders, ML engineers, and enterprise leaders exploring agentic workflows, dynamic pricing models, and vector database architectures at KTPO Whitefield.',
  category: 'Tech & AI',
  eventType: 'IN_PERSON',
  city: 'Bengaluru',
  venue: 'KTPO Trade Center, Whitefield',
  startDate: 'Nov 18 - 20, 2026',
  endDate: '2026-11-20',
  dayBadge: '18',
  monthBadge: 'NOV',
  price: 99,
  vipPrice: 199,
  capacity: 1500,
  attendeesCount: 340,
  imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  createdAt: new Date().toISOString(),
  status: 'PUBLISHED',
  isCustom: true,
};

export function formatEventDates(start: string, end?: string): { dayBadge: string; monthBadge: string; displayDate: string } {
  try {
    const dStart = new Date(start);
    if (!isNaN(dStart.getTime())) {
      const dayBadge = String(dStart.getDate()).padStart(2, '0');
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthBadge = monthNames[dStart.getMonth()] || 'MAR';
      const monthShort = dStart.toLocaleString('en-US', { month: 'short' });

      let displayDate = `${monthShort} ${dStart.getDate()}`;
      if (end) {
        const dEnd = new Date(end);
        if (!isNaN(dEnd.getTime())) {
          displayDate += ` - ${dEnd.getDate()}, ${dEnd.getFullYear()}`;
        } else {
          displayDate += `, ${dStart.getFullYear()}`;
        }
      } else {
        displayDate += `, ${dStart.getFullYear()}`;
      }
      return { dayBadge, monthBadge, displayDate };
    }
  } catch (err) {
    console.warn('Error parsing dates:', err);
  }
  return { dayBadge: '20', monthBadge: 'MAR', displayDate: start || 'Mar 20, 2026' };
}

export function getCustomEvents(): CustomEventItem[] {
  if (typeof window === 'undefined') {
    return [SEED_CUSTOM_EVENT];
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Seed with initial sample event so user sees immediate results
      localStorage.setItem(STORAGE_KEY, JSON.stringify([SEED_CUSTOM_EVENT]));
      return [SEED_CUSTOM_EVENT];
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [SEED_CUSTOM_EVENT];
  } catch (e) {
    console.warn('Failed to read custom events from localStorage:', e);
    return [SEED_CUSTOM_EVENT];
  }
}

export function saveCustomEvent(newEvent: CustomEventItem): CustomEventItem[] {
  if (typeof window === 'undefined') return [newEvent];
  try {
    const existing = getCustomEvents();
    // Prepend new event
    const updated = [newEvent, ...existing.filter((e) => e.id !== newEvent.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('eventsphere_events_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save custom event:', e);
    return [newEvent];
  }
}

export function deleteCustomEvent(id: string): CustomEventItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getCustomEvents();
    const updated = existing.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('eventsphere_events_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to delete custom event:', e);
    return [];
  }
}

export function getCustomEventById(id: string): CustomEventItem | undefined {
  const all = getCustomEvents();
  return all.find((e) => e.id === id);
}
