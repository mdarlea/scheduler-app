import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

@Injectable()
export class CalendarService {
    private addEventSource = new Subject<Jqx.Appointment>();
    private updateEventSource = new Subject<Jqx.Appointment>();
    private deleteEventSource = new Subject<any>();

    addEvent$ = this.addEventSource.asObservable();
    updateEvent$ = this.updateEventSource.asObservable();
    deleteEvent$ = this.deleteEventSource.asObservable();

    updateEvent(event: Jqx.Appointment): void {
        this.updateEventSource.next(event);
    }
    deleteEvent(eventId: any): void {
        this.deleteEventSource.next(eventId);
    }
    addEvent(event: Jqx.Appointment) {
      this.addEventSource.next(event);
    }
}
