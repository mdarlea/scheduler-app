import { Directive, TemplateRef, Self} from '@angular/core';

@Directive({
  selector: '[schedulerEditSeletedEventTemplate]'
})
export class SchedulerEditSeletedEventTemplateDirective {
  constructor(@Self() public template: TemplateRef<any>) {
  }
}
