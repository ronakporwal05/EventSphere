export type RegistrationStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'WAITLISTED' | 'CHECKED_IN';

export interface AttendeeRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketType: string;
  status: RegistrationStatus;
  registeredAt: string;
  company?: string;
  jobTitle?: string;
}

export interface CustomFormField {
  id: string;
  label: string;
  type: 'TEXT' | 'SELECT' | 'CHECKBOX';
  required: boolean;
  options?: string[];
}

export interface RegistrationMetrics {
  totalRegistrations: number;
  pendingApprovals: number;
  waitlisted: number;
  checkedIn: number;
}
