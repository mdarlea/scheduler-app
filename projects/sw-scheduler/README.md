# Scheduler
Angular component for the Jqx scheduler widget

## Install

### Install the jqwidgets
```
$ npm install jqwidgets-framework --save
```

### Install the scheduler
```
$ npm install sw-scheduler --save
```

### Update angular.json file
- Add the jqwidgets scripts to your project in angular.json file:

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

- Add the jqwidgets styles to your project in angular.json file:

"node_modules/jqwidgets-framework/jqwidgets/styles/jqx.base.css"

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

<div class="alert is-helpful">
<p>
You can run the [live example](https://stackblitz.com/edit/angular-3tkfe9) of the sample application that accompanies this guide
</p>
</div>

[How to use the Scheduler component](http://www.swaksoft.com/documentation/sw-scheduler/components/SchedulerComponent.html)

