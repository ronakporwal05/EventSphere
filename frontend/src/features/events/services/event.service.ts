import { apiClient } from '@/lib/api-client';
import { EventItem, EventQueryParams, CreateEventInput } from '../types/event.types';
import { getCustomEvents, getCustomEventById, CustomEventItem } from '@/lib/custom-events';

export const eventService = {
  getEvents: async (params: EventQueryParams): Promise<{ events: EventItem[]; total: number }> => {
    try {
      const response = await apiClient.get('/events', { params });
      return response.data.data;
    } catch {
      // Mock data fallback
      const mockEvents: EventItem[] = [
        {
          id: 'evt-101',
          title: 'EventSphere AI Global Keynote 2026',
          description: 'Flagship enterprise conference exploring multi-tenant AI analytics, RAG knowledge stores, and LLM automation.',
          category: 'Technology & AI',
          status: 'PUBLISHED',
          startDate: '2026-09-15T09:00:00Z',
          endDate: '2026-09-17T18:00:00Z',
          location: 'Grand Hyatt Convention Center, San Francisco & Virtual',
          isVirtual: true,
          virtualLink: 'https://stream.eventsphere.ai/keynote-2026',
          capacity: 5000,
          registeredCount: 3420,
          organizerName: 'Alexander Wright',
          tags: ['AI', 'Spring Boot', 'Next.js', 'Enterprise'],
          createdAt: '2026-05-01',
          sessions: [
            {
              id: 'ses-1',
              title: 'Opening Keynote: The Future of AI Event Tech',
              startTime: '09:00 AM',
              endTime: '10:30 AM',
              room: 'Main Hall A',
              speakerName: 'Dr. Aris Thorne',
              speakerRole: 'Chief AI Architect',
            },
            {
              id: 'ses-2',
              title: 'RAG Knowledge Pipelines at Scale',
              startTime: '11:00 AM',
              endTime: '12:30 PM',
              room: 'Tech Track B',
              speakerName: 'Sophia Martinez',
              speakerRole: 'Senior Staff Engineer',
            },
          ],
        },
        {
          id: 'evt-102',
          title: 'DevCon Tech Summit Spring 2026',
          description: 'Developer workshop covering microservices architecture, Qdrant vector databases, and real-time WebSocket telemetry.',
          category: 'Developer Workshop',
          status: 'PUBLISHED',
          startDate: '2026-10-01T10:00:00Z',
          endDate: '2026-10-02T17:00:00Z',
          location: 'Silicon Valley Innovation Hub, CA',
          isVirtual: false,
          capacity: 1200,
          registeredCount: 890,
          organizerName: 'Marcus Vance',
          tags: ['DevOps', 'VectorDB', 'Multi-Tenant'],
          createdAt: '2026-06-12',
        },
        {
          id: 'evt-103',
          title: 'Executive Leadership Strategy Forum',
          description: 'Exclusive round-table session for C-level executives discussing corporate compliance and data governance.',
          category: 'Executive Forum',
          status: 'DRAFT',
          startDate: '2026-11-05T08:30:00Z',
          endDate: '2026-11-05T16:00:00Z',
          location: 'The Ritz-Carlton, New York',
          isVirtual: false,
          capacity: 150,
          registeredCount: 45,
          organizerName: 'Alexander Wright',
          tags: ['Leadership', 'Governance'],
          createdAt: '2026-07-20',
        },
      ];

      let filtered = [...mockEvents];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
        );
      }
      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter((e) => e.status === params.status);
      }

      return { events: filtered, total: filtered.length };
    }
  },

  getEventById: async (id: string): Promise<EventItem> => {
    // 1. Check custom created events first
    const custom = getCustomEventById(id);
    if (custom) {
      return {
        id: custom.id,
        title: custom.title,
        description: custom.description || custom.tagline,
        category: custom.category,
        status: custom.status,
        startDate: custom.startDate,
        endDate: custom.endDate || custom.startDate,
        location: `${custom.venue}, ${custom.city}`,
        isVirtual: custom.eventType === 'VIRTUAL',
        virtualLink: custom.eventType === 'VIRTUAL' ? 'https://stream.eventsphere.ai/live' : undefined,
        capacity: custom.capacity,
        registeredCount: custom.attendeesCount,
        organizerName: 'Event Sphere AI',
        tags: [custom.category, custom.city],
        createdAt: custom.createdAt,
        coverImageUrl: custom.imageUrl,
        ticketTiers: [
          {
            id: `tier-std-${custom.id}`,
            name: 'Standard Attendee',
            price: custom.price,
            capacity: Math.round(custom.capacity * 0.7),
            available: Math.max(0, Math.round(custom.capacity * 0.7) - custom.attendeesCount),
          },
          {
            id: `tier-vip-${custom.id}`,
            name: 'VIP All-Access Pass',
            price: custom.vipPrice || custom.price * 2,
            capacity: Math.round(custom.capacity * 0.3),
            available: Math.round(custom.capacity * 0.3),
          },
        ],
      } as any;
    }

    try {
      const response = await apiClient.get(`/events/${id}`);
      return response.data.data;
    } catch {
      const all = await eventService.getEvents({});
      return all.events.find((e) => e.id === id) || all.events[0];
    }
  },

  createEvent: async (input: CreateEventInput): Promise<EventItem> => {
    const response = await apiClient.post('/events', input);
    return response.data.data;
  },

  updateEvent: async (id: string, input: Partial<CreateEventInput>): Promise<EventItem> => {
    const response = await apiClient.put(`/events/${id}`, input);
    return response.data.data;
  },

  publishEvent: async (id: string): Promise<void> => {
    await apiClient.post(`/events/${id}/publish`);
  },

  archiveEvent: async (id: string): Promise<void> => {
    await apiClient.post(`/events/${id}/archive`);
  },

  cloneEvent: async (id: string): Promise<EventItem> => {
    const response = await apiClient.post(`/events/${id}/clone`);
    return response.data.data;
  },
};
