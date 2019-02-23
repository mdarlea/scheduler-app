import { Component, ContentChild, ContentChildren, ViewChild, TemplateRef, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { QueryList} from '@angular/core';
import { OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';

import { SchedulerEditSeletedEventTemplateDirective } from './scheduler-edit-selected-event-template.directive';
import { SchedulerReadSeletedEventTemplateDirective } from './scheduler-read-selected-event-template.directive';
import { SchedulerEventTemplateDirective } from './scheduler-event-template.directive';
import { JqxSchedulerComponent } from '../jqx-scheduler/jqx-scheduler.component';
import { SchedulerService} from '../scheduler.service';
import { EventInfo} from '../event-info';
import { CalendarComponent} from '../calendar/calendar.component';
import { JqxCalendar} from '../jqx-calendar.model';

/**
 * Jqx Scheduler for Angular
 * @example
 *
  <sw-scheduler [editMode]="editMode"
            [ensureEventVisibleId]="ensureEventVisibleId"
            resourceOrientation="none"
            [getNewEvent]="getNewEvent"
            [(view)]="view"
            [date]="date"
            (selectEvent)="onSelectEvent($event)"
            (addEvent)="onAddEvent($event)"
            (updateEvent)="onUpdateEvent($event)"
            (closeEventModal)="onCloseEventModal()"
            (viewChanged)="onViewChanged($event)"
            (dateChanged)="onDateChanged($event)">
    <sw-calendar *ngFor="let calendar of calendars" [name]="calendar.name" [events]="calendar.events">
    </sw-calendar>
    <ng-template schedulerEventTemplate let-data="data">
      <div><i>{{data.subject}}</i></div>
      <div>{{data.resourceId}}</div>
    </ng-template>
    <ng-template schedulerReadSeletedEventTemplate let-selectedEvent="selectedEvent">
      <preview-event [event]="selectedEvent"></preview-event>
      <div class="modal-footer">
        <ng-container>
          <button type="button" (click)="edit(selectedEvent)" class="btn btn-success">
            Edit
          </button>
          <button type="button" (click)="delete(selectedEvent)" class="btn btn-danger">
            <span class="glyphicon glyphicon-remove"></span>Delete
          </button>
          <button type="button" class="btn btn-default" data-dismiss="modal">
            <span class="glyphicon glyphicon-log-out"></span>Close
          </button>
        </ng-container>
      </div>
    </ng-template>
    <ng-template schedulerEditSeletedEventTemplate let-selectedEvent="selectedEvent">
      <form class="form-group" (ngSubmit)="onSave()" ngNativeValidate>
        <edit-event [event]="selectedEvent"></edit-event>
        <div class="modal-footer">
          <ng-container>
            <button type="submit" class="btn btn-success">
              <span class="glyphicon glyphicon-ok"></span>Save
            </button>
            <button type="button" (click)="delete(selectedEvent)" class="btn btn-danger">
              <span class="glyphicon glyphicon-remove"></span>Delete
            </button>
            <button type="button" class="btn btn-default" data-dismiss="modal">
              <span class="glyphicon glyphicon-log-out"></span>Close
            </button>
          </ng-container>
        </div>
      </form>
    </ng-template>
  </sw-scheduler>
*/
@Component({
  selector: 'sw-scheduler',
  templateUrl: './scheduler.component.html',
  styles: [],
  providers: [SchedulerService]
})
export class SchedulerComponent implements OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy {
  /**
   * @ignore
   */
  private initialized = false;

  /**
  * @ignore
  */
  private setEventTemplate = false;

  /**
   * @ignore
   */
  private subscription: Subscription;

  /**
 * @ignore
 */
  private messageSubscription: Subscription;

  /**
   * @ignore
   */
  private addCalendarSubscription: Subscription;

  /**
 * @ignore
 */
  private jqxCalendars = new Array<JqxCalendar>();

  /**
   * @ignore
   */
  selectedEvent: any;

  /**
  * @ignore
  */
  messages = new Array<string>();

 /**
 * If true then the dialog box for the selected event will display the schedulerReadSeletedEventTemplate template
 * otherwize it will dispaly the schedulerEditSeletedEventTemplate template
 */
  @Input() editMode = false;

  /**
  * @ignore
  */
  @Input() draggable = false;

  /**
  * Defines the resources representation. Possible values - 'none', 'horizontal', 'vertical'
  */
  @Input() resourceOrientation: string;

  /**
   * Function that returnes a new event object that is set to the selectedEvent property
   * when a new event is added to the calendar. A new event is added when the user double clicks
   * a cell in the calendar.
   * The function receives an input parameter of type EventInfo
   *
   * <b>Example</b>
    ```typescript
        getNewEvent = (eventInfo: EventInfo) => {
        const event = {
          id: -1,
          start: eventInfo.startTime,
          end: eventInfo.endTime,
          calendar: 'Room 1'
        };
        return event;
      }
    ```
    ```html
    <sw-scheduler [getNewEvent]="getNewEvent" ... >
      <ng-template schedulerReadSeletedEventTemplate let-selectedEvent="selectedEvent">
       ...
      </ng-template>
      <ng-template schedulerEditSeletedEventTemplate let-selectedEvent="selectedEvent">
       ...
      </ng-template>
    </sw-scheduler>
    ```
 */
  @Input() getNewEvent: Function;

  /**
  * Scrolls to an event if it is out of the visible area. Set the id value of this event
  */
  @Input() ensureEventVisible: any;

  /**
  * The Scheduler's Date
  */
  @Input() date: Date;

  /**
   * Event fired when the user double clicks a cell in the calendar
   * The $event parameter is the new event object created when the user double clicks a cell in the calendar.
   * This event object is returned by the function bound to the getNewEvent input property
   */
  @Output() addEvent = new EventEmitter<any>();

  /**
   * Event fired when a user selects (clicks) an event in the calendar.
   * The $event parameter is the event object selected by the user.
   * The selectedEvent property is set to this object as well.
   */
  @Output() selectEvent = new EventEmitter<any>();

  /**
   * Event fired when the appointment was changed by dragging and dropping or resizing it in the calendar
   * The $event parameter is of the following type:
   ```
    {
      id: any,
      startTime: Date,
      endTime: Date,
      rootAppointment?: {
        id: any,
        recurrenceException: string
      }
    }
    ```
    If an occurance of a recurring appointment is dragged and dropped or resized in the calendar then the rootAppointment property is set.
    The id is set to the id of the recurring appointment. The resourceException is set to the date from which the occurance was changed.
    For example: The appointment with the id = 3 is a recurring daily appointment from 1 PM to 2 PM.
    The user drags the occurance from 03/01/2019 1PM and drops it to 03/01/2019 3PM. The $event object will be:
    ```
    {
      id: 3.2345,
      startTime: 03/01/2019 3 PM,
      endTime: 03/01/2019 4 PM;
      rootAppointment?: {
        id: 3,
        recurrenceException: '2019-03-01 12:00:00';
      }
    }
    ```
   */
  @Output() updateEvent = new EventEmitter<EventInfo>();

  /**
   * Event fired when the dialog box associated with the selected event is closed
   */
  @Output() closeEventModal = new EventEmitter<any>();

    /**
   * Event fired when the scheduler view is changed.
   * The $event parameter is an object of the following type:
   ```
     {
        from: Date,
        to: Date,
        view: string
      }
    ```
   */
  @Output() viewChanged = new EventEmitter<any>();

  /**
   * Event fired when the scheduler date range is changed.
   * The $event parameter is an object of the following type:
   ```
    {
        date: Date,
        from: Date,
        to: Date,
        view: string
     }
    ```
   */
  @Output() dateChanged = new EventEmitter<any>();

  /**
  * @ignore
  */
  @Output() viewChange = new EventEmitter<string>();

  /**
  * @ignore
  */
  private viewValue: string;

  /**
  * @ignore
  */
  set view (value: string) {
    if (value !== this.viewValue) {
      this.viewValue = value;
      this.viewChange.emit(value);
    }
  }

  /**
  * Two way data binding property.
    The Scheduler's view.
    Possible vales: 'dayView', 'weekView', 'monthView', 'timelineDayView', 'timelineWeekView' and 'timelineMonthView'.
  */
  @Input()
  get view() {
    return this.viewValue;
  }

  /**
   * Content children of calendar components.
  Selector: ```sw-calendar```

  The calendar component has 2 input properties:
*

   | Name   | Type       | Description                      |
   |--------|------------|----------------------------------|
   | name   | string     | The calendar (resource) name     |
   | events | Array<any> | Array of the bound event objects |

   The bound event objects must have the following properties:
*

   | Name                | Type   | Req/Opt  | Description                                                                          |
   |---------------------|--------|----------|--------------------------------------------------------------------------------------|
   | id                  | any    | required | The id of the event                                                                  |
   | description         | string | optional | Event description                                                                    |
   | location            | string | optional | Event location                                                                       |
   | subject             | string | optional | Event subject                                                                        |
   | start               | Date   | required | Event start date time                                                                |
   | end                 | Date   | required | Event end date time                                                                  |
   | recurrencePattern   | string | optional | Recurrent  event (appointment). Please see more information below                    |
   | recurrenceException | string | optional | Exception dates for recurrent event (appointment). Please see more information below |

   - **recurrencePattern** - string field. Defines the appointment's recurrence rule. Ex: "FREQ=DAILY;". List of supported keywords:
FREQ - "DAILY" / "WEEKLY" / "MONTHLY" / "YEARLY". The FREQ rule part identifies the type of recurrence rule. This rule part MUST be specified in the recurrence rule.
COUNT - Number. The Count rule part defines the number of occurrences at which to range-bound the recurrence.
UNTIL - String like "UNTIL=20160919T210000Z". The UNTIL rule part defines a date-time value where the recurrence ends.
BYDAY - String like "MO,TU". The BYDAY rule part specifies a COMMA character (US-ASCII decimal 44) separated list of days of the week; MO indicates Monday; TU indicates Tuesday; WE indicates Wednesday; TH indicates Thursday; FR indicates Friday; SA indicates Saturday; SU indicates Sunday. Each BYDAY value can also be preceded by a positive (+n) or negative (-n) integer. If present, this indicates the nth occurrence of the specific day within the MONTHLY or YEARLY RRULE. For example, within a MONTHLY rule, +1MO (or simply 1MO) represents the first Monday within the month, whereas -1MO represents the last Monday of the month.
BYMONTHDAY - String like 15, 30. The BYMONTHDAY rule part specifies a COMMA character (ASCII decimal 44) separated list of days of the month. Valid values are 1 to 31
BYMONTH - Number like 1. The BYMONTH rule part specifies a month of the year. Valid values are 1 to 12.
INTERVAL - Number like 1. The INTERVAL rule part contains a positive integer representing how often the recurrence rule repeats. The default value is "1",
Examples: "FREQ=WEEKLY;BYDAY=MO,WE", "FREQ=MONTHLY;BYMONTHDAY=10,15;COUNT=20", "FREQ=DAILY;INTERVAL=3;COUNT=10", "FREQ=MONTHLY;BYDAY=-2FR;COUNT=7", "FREQ=YEARLY;COUNT=30;BYMONTH=3"

  - **recurrenceException** - string field. Defines the exceptions of the recurrence rule. The bound value should be a string or comma separated list of Date strings. Example: "2016-11-24 09:00:00,2016-11-26 12:00:00"

  **Example:**
   ```typescript
      roomOne = new Array<{id: number, subject: string, start: Date, end: Date}>();
      roomTwo = new Array<{id: number, subject: string, start: Date, end: Date}>();

      ngOnInit() {
        let start = new Date();
        let end = new Date();
        start.setHours(10, 0, 0, 0);
        end.setHours(11, 0, 0, 0);
        this.roomOne.push({id: 1, subject: '1st subject', start: start, end: end});

        start = new Date();
        end = new Date();
        start.setHours(12, 0, 0, 0);
        end.setHours(13, 0, 0, 0);
        this.roomOne.push({id: 2, subject: '2nd subject', start: start, end: end});

        start = new Date();
        end = new Date();
        start.setHours(13, 0, 0, 0);
        end.setHours(14, 0, 0, 0);
        this.roomTwo.push({id: 3, subject: '3rd subject', start: start, end: end});
      }
   ```
   ```html
    <sw-scheduler ... >
      <sw-calendar name="Room 1" [events]="roomOne">
      </sw-calendar>
      <sw-calendar name="Room 2" [events]="roomTwo">
      </sw-calendar>
      ...
    </sw-scheduler>
   ```
   */
  @ContentChildren(CalendarComponent) calendars: QueryList<CalendarComponent>;

  /**
   * Content child of the schedulerEditSeletedEventTemplate template.
   * The template is bound to the selectedEvent property which is set to the event object selected
   * by the user when he clicks an event in the calendar.
   * The template contains the markup for the dialog box that is opened when the event is selected
   * in the calendar in edit mode (editMode = true)
   *
   * <b>Example</b>
```html
   <sw-scheduler ... >
      <ng-template schedulerEditSeletedEventTemplate let-selectedEvent="selectedEvent">
       ...
      </ng-template>
      ...
    </sw-scheduler>
```
   */
  @ContentChild(SchedulerEditSeletedEventTemplateDirective, { read: TemplateRef })
  schedulerEditSeletedEventTemplate: TemplateRef<any>;

   /**
   * Content child of the schedulerReadSeletedEventTemplate template.
   * The template is bound to the selectedEvent property which is set to the event object selected
   * by the user when he clicks an event in the calendar.
   * The template contains the markup for the dialog box that is opened when the event is selected
   * in the calendar in read mode (editMode = false)
   *
   * <b>Example</b>
```html
   <sw-scheduler ... >
      <ng-template schedulerReadSeletedEventTemplate let-selectedEvent="selectedEvent">
       ...
      </ng-template>
      ...
    </sw-scheduler>
```
*/
  @ContentChild(SchedulerReadSeletedEventTemplateDirective, { read: TemplateRef })
  schedulerReadSeletedEventTemplate: TemplateRef<any>;

  /**
   * Content child of the schedulerEventTemplate
   * The template is bound to the jqx appointment object which is created when a new appointment is rendered
   * in the calendar
   *
   * <b>Example</b>
```html
  <sw-scheduler ... >
    <ng-template schedulerEventTemplate let-data="data">
      <div><i>{{data.subject}}</i></div>
      <div>{{data.resourceId}}</div>
    </ng-template>
  </sw-scheduler>
```
*/
  @ContentChild(SchedulerEventTemplateDirective, { read: TemplateRef })
  schedulerEventTemplate: TemplateRef<any>;

  /**
   * @ignore
   */
  @ViewChild(JqxSchedulerComponent) jqxScheduler: JqxSchedulerComponent;

  /**
  * @ignore
  */
  @ViewChild('eventModal') eventModal: ElementRef;

  constructor(private schedulerSvc: SchedulerService) {
    this.subscription = this.schedulerSvc.addOrRemoveEventTemplate$.subscribe(value => {
      // tslint:disable-next-line:curly
      if (!this.initialized) return;

      this.setEventTemplate = true;
    });
    this.addCalendarSubscription = this.schedulerSvc.addCalendar$.subscribe(data => {
      if (this.initialized) {
        // notify the jqx scheduler
        this.schedulerSvc.addJqxEvents(data);
      } else {
        const jqxCalendars = this.jqxCalendars.filter(calendar => calendar.calendar === data.calendar);
        if (jqxCalendars.length > 0) {
          for (const appointment of data.appointments) {
            jqxCalendars[0].appointments.push(appointment);
          }
        } else {
          this.jqxCalendars.push(data);
        }
      }
    });
    // this.messageSubscription = this.schedulerSvc.sendMessage$.subscribe(message => {
    //    this.messages.push(message);
    //  });
   }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    this.jqxScheduler.eventTemplate = this.schedulerEventTemplate;
  }
  ngAfterViewInit(): void {
    $(this.eventModal.nativeElement).on('hidden.bs.modal', () => {
      this.closeEventModal.emit();
    });
    if (this.jqxCalendars.length > 0) {
      // notify the jqx scheduler
      for (const jqxCalendar of this.jqxCalendars) {
        this.schedulerSvc.addJqxEvents(jqxCalendar);
      }
    }
    this.initialized = true;
  }

  ngAfterContentChecked(): void {
    // tslint:disable-next-line:curly
    if (!this.initialized) return;

    if (this.setEventTemplate) {
      this.setEventTemplate = false;
      this.jqxScheduler.eventTemplate = this.schedulerEventTemplate;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.addCalendarSubscription.unsubscribe();

    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  /**
   * Close the selected event dialog box if it is opened
   */
  closeSelectedEvent() {
    this.hideModal();
  }

  /**
   * Renders the scheduler
   */
  render(id?: any) {
    this.schedulerSvc.renderSqxScheduler(id);
  }

  /**
  * @ignore
  */
  clearMessages() {
    this.messages = [];
  }

  /**
  * @ignore
  */
  private hideModal() {
    $(this.eventModal.nativeElement).modal('hide');
  }

  /**
  * @ignore
  */
  private showModal() {
    $(this.eventModal.nativeElement).modal('show');
  }

  /**
  * @ignore
  */
  getSubject() {
    return (this.selectedEvent && this.selectedEvent.subject) ? this.selectedEvent.subject : 'New Event';
  }

  /**
  * @ignore
  */
  private setSelectedEvent(eventInfo: EventInfo) {
    if (this.calendars) {
      this.calendars.forEach(calendar => {
        if (calendar.events) {
          for (const event of calendar.events) {
            if (event.id === eventInfo.id) {
              this.selectedEvent = event;
              return;
            }
          }
        }
      });
    }
  }

  /**
  * @ignore
  */
  onViewChanged(args: any) {
    this.viewChanged.emit(args);
  }

  /**
  * @ignore
  */
  onDateChanged(args: any) {
    this.dateChanged.emit(args);
  }

  /**
  * @ignore
  */
  onUpdateEvent(eventInfo: EventInfo) {
    this.selectedEvent = null;
    this.updateEvent.emit(eventInfo);
  }

  /**
  * @ignore
  */
  onSelectEvent(eventInfo: EventInfo) {
    this.setSelectedEvent(eventInfo);
    this.showModal();
    this.selectEvent.emit(this.selectedEvent);
  }

  /**
  * @ignore
  */
  onAddEvent(eventInfo: EventInfo) {
    if (!this.getNewEvent) {
      throw new Error('onNewEvent function must be set');
    }

    const newEvent = this.getNewEvent(eventInfo);
    this.selectedEvent = newEvent;
    this.showModal();
    this.addEvent.emit(newEvent);
  }
}
