import { Directive, OnChanges, Input, OnInit, OnDestroy, Host } from '@angular/core';
import { CalendarService } from './calendar.service';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'event'
})
export class EventDirective implements OnChanges, OnInit, OnDestroy {
  @Input() id: any;
    @Input() description: string;
    @Input() location: string;
    @Input() subject: string;
    @Input() start: Date;
    @Input() end: Date;
    @Input() recurrencePattern: string;
    @Input() recurrenceException: string;

    private event: Jqx.Appointment;

    constructor(private calendarSvc: CalendarService) {
    }

    ngOnChanges(changes: any) {
        // tslint:disable-next-line:curly
        if (!this.event) return;
        let isChanged = false;

        for (const property in changes) {
          if (changes.hasOwnProperty(property)) {
            const value = changes[property].currentValue;
            this.event[property] = value;
            isChanged = true;
          }
        }

        if (isChanged) {
            this.calendarSvc.updateEvent(this.event);
        }
    }

    ngOnInit() {
        this.event = {
            id: this.id,
            subject: this.subject,
            location: this.location,
            description: this.description,
            start: this.start,
            end: this.end,
            recurrencePattern: this.recurrencePattern
        };

        this.calendarSvc.addEvent(this.event);
    }

    ngOnDestroy() {
        this.calendarSvc.deleteEvent(this.event.id);
    }
}
