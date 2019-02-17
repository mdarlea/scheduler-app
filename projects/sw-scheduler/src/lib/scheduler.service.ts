import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { JqxCalendar} from './jqx-calendar.model';

@Injectable()
export class SchedulerService {
    private addOrRemoveEventTemplateSource = new Subject<any>();
    private renderJqxSchedulerSource = new Subject<any>();
    private addJqxEventsSource = new Subject<JqxCalendar>();
    private updateJqxEventsSource = new Subject<JqxCalendar>();
    private deleteJqxEventsSource = new Subject<Array<any>>();
    private deleteJqxCalendarSource = new Subject<string>();
    private addCalendarSource = new Subject<JqxCalendar>();
    private sendMessageSource = new Subject<string>();

    addOrRemoveEventTemplate$ = this.addOrRemoveEventTemplateSource.asObservable();
    renderJqxScheduler$ = this.renderJqxSchedulerSource.asObservable();
    addJqxEvents$ = this.addJqxEventsSource.asObservable();
    updateJqxEvents$ = this.updateJqxEventsSource.asObservable();
    deleteJqxEvents$ = this.deleteJqxEventsSource.asObservable();
    deleteJqxCalendar$ = this.deleteJqxCalendarSource.asObservable();
    addCalendar$ = this.addCalendarSource.asObservable();
    sendMessage$ = this.sendMessageSource.asObservable();

    addOrRemoveEventTemplate() {
      this.addOrRemoveEventTemplateSource.next(null);
    }

    renderSqxScheduler(id?: any) {
      this.renderJqxSchedulerSource.next(id);
    }

    addJqxEvents(events: JqxCalendar) {
      this.addJqxEventsSource.next(events);
    }

    updateJqxEvents(events: JqxCalendar) {
      this.updateJqxEventsSource.next(events);
    }

    deleteJqxEvents(ids: Array<any>) {
      this.deleteJqxEventsSource.next(ids);
    }

    deleteJqxCalendar(name: string) {
      this.deleteJqxCalendarSource.next(name);
    }

    addCalendar(calendar: JqxCalendar) {
      this.addCalendarSource.next(calendar);
    }

    sendMessage(value: string) {
      this.sendMessageSource.next(value);
    }
}
