import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

import { JqxAppointment } from '../jqx-appointment';
import { UpdateEventInfo } from './update-event-info';

@Injectable()
export class CalendarService {
    private addEventSource = new Subject<JqxAppointment>();
    private updateEventSource = new Subject<UpdateEventInfo>();
    private deleteEventSource = new Subject<any>();

    addEvent$ = this.addEventSource.asObservable();
    updateEvent$ = this.updateEventSource.asObservable();
    deleteEvent$ = this.deleteEventSource.asObservable();

    updateEvent(eventInfo: UpdateEventInfo): void {
        this.updateEventSource.next(eventInfo);
    }
    deleteEvent(eventId: any): void {
        this.deleteEventSource.next(eventId);
    }
    addEvent(event: JqxAppointment) {
      this.addEventSource.next(event);
    }
}
