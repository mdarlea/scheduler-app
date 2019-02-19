export interface JqxAppointment {
  id: any;
  description?: string;
  location?: string;
  subject?: string;
  calendar?: string;
  start: Date;
  end: Date;
  recurrencePattern?: string;
  recurrenceException?: string;
  instructor?: string;
  draggable?: boolean;
  color?: string;
}
