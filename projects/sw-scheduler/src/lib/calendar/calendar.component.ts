import { Subscription } from 'rxjs';

import { Component, OnChanges, Input, OnInit, OnDestroy, Host, AfterContentInit, AfterViewInit } from '@angular/core';
import { SchedulerService } from '../scheduler.service';
import { CalendarService} from './calendar.service';
import { JqxAppointment } from '../jqx-appointment';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'sw-calendar',
    templateUrl: './calendar.component.html',
    providers: [CalendarService]
})
export class CalendarComponent implements OnChanges, OnInit, AfterContentInit, AfterViewInit, OnDestroy {
    private initialized = false;
    private jqxAppointments = new Array<JqxAppointment>();

    private addEventSubscription: Subscription;
    private updateEventSubscription: Subscription;
    private deleteEventSubscription: Subscription;

    @Input() name: string;
    @Input() events = new Array<any>();

    constructor(@Host() private schedulerSvc: SchedulerService, private calendarSvc: CalendarService) {
    }

    ngOnChanges(changes: any) {
      // tslint:disable-next-line:curly
      if (!this.initialized) return;

      if (changes && 'name' in changes) {
        const calendar = changes.name.currentValue;
        for (const jqxAppointment of this.jqxAppointments) {
          jqxAppointment.calendar = calendar;
        }
        this.schedulerSvc.updateJqxEvents({calendar: calendar, appointments: this.jqxAppointments});
      }
    }

    ngOnInit() {
      this.addEventSubscription = this.calendarSvc.addEvent$.subscribe(jqxAppointment => {
        jqxAppointment.calendar = this.name;
        this.jqxAppointments.push(jqxAppointment);

        if (this.initialized) {
          this.schedulerSvc.addJqxEvents({calendar: this.name, appointments: [jqxAppointment]});
        }
      });
      this.updateEventSubscription = this.calendarSvc.updateEvent$.subscribe(jqxAppointmentInfo => {
        jqxAppointmentInfo.jqxAppointment.calendar = this.name;
        this.schedulerSvc.updateJqxEvents({
          calendar: this.name,
          appointments: [jqxAppointmentInfo.jqxAppointment],
          recurrenceChanged: jqxAppointmentInfo.recurrenceChanged});
      });
      this.deleteEventSubscription = this.calendarSvc.deleteEvent$.subscribe(id => {
        for (let i = 0; i < this.jqxAppointments.length; i++) {
          if (this.jqxAppointments[i].id === id) {
            this.jqxAppointments.splice(i, 1);
            break;
          }
        }
        this.schedulerSvc.deleteJqxEvents([id]);
      });
    }

    ngAfterContentInit() {

    }

    ngAfterViewInit() {
      this.schedulerSvc.addCalendar({calendar: this.name, appointments: this.jqxAppointments});
      this.initialized = true;
    }

    ngOnDestroy() {
      // delete this calendar
      this.jqxAppointments = [];
      this.schedulerSvc.deleteJqxCalendar(this.name);

      if (this.addEventSubscription) {
        this.addEventSubscription.unsubscribe();
      }
      if (this.updateEventSubscription) {
        this.updateEventSubscription.unsubscribe();
      }
      if (this.deleteEventSubscription) {
        this.deleteEventSubscription.unsubscribe();
      }
    }
}
