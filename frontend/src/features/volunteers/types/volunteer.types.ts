export type VolunteerShiftStatus = 'ON_SHIFT' | 'OFF_SHIFT' | 'ON_BREAK';

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedZone: string;
  shiftTime: string;
  status: VolunteerShiftStatus;
  scansProcessed: number;
}

export interface VolunteerAuditActivity {
  id: string;
  volunteerName: string;
  action: string;
  timestamp: string;
  zone: string;
}
