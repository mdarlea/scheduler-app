export interface EventInfo {
    id: any;
    startTime: Date;
    endTime: Date;
    rootAppointment?: {
      id: any,
      recurrenceException: string;
    };
}
