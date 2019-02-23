# Scheduler
Angular component for the Jqx scheduler widget

## Install

### Install jquery
```
$ npm install jquery --save
```

### Install the jqwidgets
```
$ npm install jqwidgets-framework --save
```

### Install the scheduler
```
$ npm install sw-scheduler --save
```

### Update angular.json file
* Add the jqwidgets scripts to your project in angular.json file:

```
"node_modules/jqwidgets-framework/jqwidgets/jqxcore.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxbuttons.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxscrollbar.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxdata.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxdate.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxscheduler.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxscheduler.api.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxdatetimeinput.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxmenu.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxcalendar.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxtooltip.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxwindow.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxcheckbox.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxlistbox.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxdropdownlist.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxnumberinput.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxradiobutton.js",
"node_modules/jqwidgets-framework/jqwidgets/jqxinput.js",
"node_modules/jqwidgets-framework/jqwidgets/globalization/globalize.js",
"node_modules/jqwidgets-framework/jqwidgets/globalization/globalize.culture.de-DE.js"
```

* Add the jqwidgets styles to your project in angular.json file:

```
"node_modules/jqwidgets-framework/jqwidgets/styles/jqx.base.css"
```

## Import the Scheduler module
```typescript
import { SchedulerModule } from 'sw-scheduler';

@NgModule({
 imports: [
   SchedulerModule,
   ...
 ],
 ...
})
export class AppModule { ... }


```

## Usage

You can run the [live example](https://stackblitz.com/edit/angular-3tkfe9/) of the sample application that accompanies this guide

[How to use the Scheduler component](http://www.swaksoft.com/documentation/sw-scheduler/components/SchedulerComponent.html)

**Example**

```html
  <sw-scheduler [editMode]="editMode"
            [ensureEventVisible]="ensureEventVisibleId"
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
          <button type="button" (click)="edit(selectedEvent)" class="btn btn-success">
            Edit
          </button>
          <button type="button" (click)="delete(selectedEvent)" class="btn btn-danger">
            <span class="glyphicon glyphicon-remove"></span>Delete
          </button>
          <button type="button" class="btn btn-default" data-dismiss="modal">
            <span class="glyphicon glyphicon-log-out"></span>Close
          </button>        
      </div>
    </ng-template>
    <ng-template schedulerEditSeletedEventTemplate let-selectedEvent="selectedEvent">
      <form class="form-group" (ngSubmit)="onSave()" ngNativeValidate>
        <edit-event [event]="selectedEvent"></edit-event>
        <div class="modal-footer">          
            <button type="submit" class="btn btn-success">
              <span class="glyphicon glyphicon-ok"></span>Save
            </button>
            <button type="button" (click)="delete(selectedEvent)" class="btn btn-danger">
              <span class="glyphicon glyphicon-remove"></span>Delete
            </button>
            <button type="button" class="btn btn-default" data-dismiss="modal">
              <span class="glyphicon glyphicon-log-out"></span>Close
            </button>          
        </div>
      </form>
    </ng-template>
  </sw-scheduler>
```

### Input properties

#### ```editMode```
Type: boolean

If true then the dialog box for the selected event will display the schedulerReadSeletedEventTemplate template,
otherwize it will dispaly the schedulerEditSeletedEventTemplate template

#### ```resourceOrientation```
Type: string

Defines the resources representation. Possible values - 'none', 'horizontal', 'vertical'

#### ```getNewEvent```
Type: Function

Function that returnes a new event object that is set to the selectedEvent property
when a new event is added to the calendar. A new event is added when the user double clicks
a cell in the calendar.
The function receives an input parameter of type EventInfo

**Example**

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
#### ```ensureEventVisible```
Type: any

Scrolls to an event if it is out of the visible area. Set the id value of this event.

#### ```date```
Type: Date

The Scheduler's Date

### Content children

#### Calendar

  Selector: ```sw-calendar```

  The calendar component has 2 input properties:

   | Name   | Type       | Description                      |
   |--------|------------|----------------------------------|
   | name   | string     | The calendar (resource) name     |
   | events | Array<any> | Array of the bound event objects |

   The bound event objects must have the following properties:

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

#### Event template

Selector: ```schedulerEventTemplate```
The template is bound to the jqx appointment object which is created when a new appointment is rendered in the calendar
  
  **Example**

```html
  <sw-scheduler ... >
    <ng-template schedulerEventTemplate let-data="data">
      <div><i>{{data.subject}}</i></div>
      <div>{{data.resourceId}}</div>
    </ng-template>
  </sw-scheduler>
```

#### Selected event template - read mode

Selector: ```schedulerReadSeletedEventTemplate```
The template is bound to the selectedEvent property which is set to the event object selected by the user when he clicks an event in the calendar.
The template contains the markup for the dialog box that is opened when the event is selected in the calendar in read mode (editMode = false)

**Example**
```html
   <sw-scheduler ... >
      <ng-template schedulerReadSeletedEventTemplate let-selectedEvent="selectedEvent">
       ...
      </ng-template>
      ...
    </sw-scheduler>
```

####  Selected event template - edit mode

Selector: ```schedulerEditSeletedEventTemplate```
The template is bound to the selectedEvent property which is set to the event object selected by the user when he clicks an event in the calendar.
The template contains the markup for the dialog box that is opened when the event is selected in the calendar in edit mode (editMode = true)

**Example**
```html
   <sw-scheduler ... >
      <ng-template schedulerEditSeletedEventTemplate let-selectedEvent="selectedEvent">
       ...
      </ng-template>
      ...
    </sw-scheduler>
```

### Events



