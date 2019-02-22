import { JqxAppointment } from '../jqx-appointment';

export interface UpdateEventInfo {
  jqxAppointment: JqxAppointment;
  recurrenceChanged: boolean;
}
