import { JqxAppointment } from './jqx-appointment';

export interface JqxCalendar {
  calendar: string;
  appointments: Array<JqxAppointment>;
}
