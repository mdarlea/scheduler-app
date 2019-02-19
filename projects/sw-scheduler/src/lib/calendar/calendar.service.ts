import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

import { JqxAppointment } from '../jqx-appointment';

@Injectable()
export class CalendarService {
    private addEventSource = new Subject<JqxAppointment>();
    private updateEventSource = new Subject<JqxAppointment>();
    private deleteEventSource = new Subject<any>();

    addEvent$ = this.addEventSource.asObservable();
    updateEvent$ = this.updateEventSource.asObservable();
    deleteEvent$ = this.deleteEventSource.asObservable();

    updateEvent(event: JqxAppointment): void {
        this.updateEventSource.next(event);
    }
    deleteEvent(eventId: any): void {
        this.deleteEventSource.next(eventId);
    }
    addEvent(event: JqxAppointment) {
      this.addEventSource.next(event);
    }
}
