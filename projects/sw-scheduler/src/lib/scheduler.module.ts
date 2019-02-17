import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulerComponent } from './scheduler-root/scheduler.component';
import { SchedulerEditSeletedEventTemplateDirective } from './scheduler-root/scheduler-edit-selected-event-template.directive';
import { SchedulerReadSeletedEventTemplateDirective } from './scheduler-root/scheduler-read-selected-event-template.directive';
import { SchedulerEventTemplateDirective } from './scheduler-root/scheduler-event-template.directive';
import { JqxSchedulerComponent } from './jqx-scheduler/jqx-scheduler.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventDirective } from './calendar/event.directive';

/**
 * Module for the sw-scheduler component
 */
@NgModule({
  declarations: [
    SchedulerComponent,
    SchedulerEditSeletedEventTemplateDirective,
    SchedulerReadSeletedEventTemplateDirective,
    SchedulerEventTemplateDirective,
    JqxSchedulerComponent,
    CalendarComponent,
    EventDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SchedulerComponent,
    SchedulerEditSeletedEventTemplateDirective,
    SchedulerReadSeletedEventTemplateDirective,
    SchedulerEventTemplateDirective,
    CalendarComponent
  ]
})
export class SchedulerModule { }
