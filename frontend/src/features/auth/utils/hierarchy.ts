import { UserProfile, UserRole } from '../types/auth.types';

export type HierarchyRoleType = 'ADMIN' | 'EVENT_MANAGER' | 'USER' | 'GUEST';

export interface HierarchyDefinition {
  level: number;
  label: string;
  badgeTitle: string;
  badgeColor: string;
  description: string;
  allowedTabs: string[];
}

export const HIERARCHY_CONFIG: Record<HierarchyRoleType, HierarchyDefinition> = {
  ADMIN: {
    level: 3,
    label: 'System & Organization Admin',
    badgeTitle: '👑 ADMIN',
    badgeColor: 'bg-purple-600 text-white border-black',
    description: 'Supreme governance: full authority over all tenants, AI models, organizers, turnstiles, and billing.',
    allowedTabs: [
      '/',
      '/events',
      '/pricing',
      '/schedule',
      '/speakers',
      '/about',
      '/venue',
      '/events/create',
      '/ai-studio',
      '/manage',
      '/scanner',
      '/admin',
      '/organization',
      '/analytics',
      '/users',
      '/settings',
      '/portal',
      '/registrations',
    ],
  },
  EVENT_MANAGER: {
    level: 2,
    label: 'Event Manager / Organizer',
    badgeTitle: '🏢 EVENT MANAGER',
    badgeColor: 'bg-indigo-600 text-white border-black',
    description: 'Operational control: event creation, dynamic ticket yields, turnstile scanner, and attendee management.',
    allowedTabs: [
      '/',
      '/events',
      '/pricing',
      '/schedule',
      '/speakers',
      '/about',
      '/venue',
      '/events/create',
      '/ai-studio',
      '/manage',
      '/scanner',
      '/analytics',
      '/portal',
      '/registrations',
    ],
  },
  USER: {
    level: 1,
    label: 'Attendee / General User',
    badgeTitle: '👤 USER',
    badgeColor: 'bg-emerald-600 text-white border-black',
    description: 'Participant access: browse events, buy tickets, seat selection, and digital pass wallet.',
    allowedTabs: [
      '/',
      '/events',
      '/pricing',
      '/schedule',
      '/speakers',
      '/about',
      '/venue',
      '/portal',
      '/profile',
    ],
  },
  GUEST: {
    level: 0,
    label: 'Public Visitor',
    badgeTitle: 'VISITOR',
    badgeColor: 'bg-neutral-600 text-white border-black',
    description: 'Unauthenticated public summit viewer.',
    allowedTabs: [
      '/',
      '/events',
      '/pricing',
      '/schedule',
      '/speakers',
      '/about',
      '/venue',
      '/login',
      '/register',
    ],
  },
};

/**
 * Resolves any raw role string to one of our three core hierarchical roles.
 */
export function resolveHierarchyRole(role?: string | null): HierarchyRoleType {
  if (!role) return 'GUEST';
  const r = role.toUpperCase();
  if (r.includes('ADMIN') || r.includes('SUPER') || r === 'ORGANIZATION_ADMIN' || r === 'SYSTEM_ADMIN') {
    return 'ADMIN';
  }
  if (r.includes('MANAGER') || r.includes('ORGANIZER')) {
    return 'EVENT_MANAGER';
  }
  return 'USER';
}

/**
 * Returns numeric power level (0 to 3).
 */
export function getHierarchyPowerLevel(role?: string | null): number {
  return HIERARCHY_CONFIG[resolveHierarchyRole(role)].level;
}

/**
 * Checks if a user's role satisfies the required minimum role level.
 */
export function hasHierarchyAccess(
  userRole: string | null | undefined,
  requiredRole: HierarchyRoleType
): boolean {
  const userPower = getHierarchyPowerLevel(userRole);
  const requiredPower = HIERARCHY_CONFIG[requiredRole].level;
  return userPower >= requiredPower;
}

/**
 * Checks whether a given path is allowed for the user's role.
 */
export function isPathAllowedForRole(pathname: string, userRole?: string | null): boolean {
  const resolved = resolveHierarchyRole(userRole);
  const allowed = HIERARCHY_CONFIG[resolved].allowedTabs;

  return allowed.some((allowedPath) => {
    if (allowedPath === '/') return pathname === '/';
    return pathname === allowedPath || pathname.startsWith(`${allowedPath}/`);
  });
}

/**
 * Predefined demo accounts for 1-click hierarchical authentication & switching.
 */
export const HIERARCHICAL_ACCOUNTS: Record<
  Exclude<HierarchyRoleType, 'GUEST'>,
  {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatarUrl?: string;
    description: string;
    defaultRedirect: string;
  }
> = {
  ADMIN: {
    email: 'admin@eventsphere.ai',
    firstName: 'Alex',
    lastName: 'Mercer',
    role: 'ORGANIZATION_ADMIN',
    description: 'Supreme Admin — Controls all system tenants, turnstiles, models, and global configs.',
    defaultRedirect: '/admin',
  },
  EVENT_MANAGER: {
    email: 'manager@eventsphere.ai',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    role: 'EVENT_MANAGER',
    description: 'Event Manager — Organizes summits, controls ticket sales, scanner gates, and AI studio.',
    defaultRedirect: '/manage',
  },
  USER: {
    email: 'user@eventsphere.ai',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'ATTENDEE',
    description: 'General User / Attendee — Buys tickets, picks auditorium seats, and views QR pass wallet.',
    defaultRedirect: '/portal',
  },
};
