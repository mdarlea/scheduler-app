import { Directive, TemplateRef, Self} from '@angular/core';

@Directive({
  selector: '[schedulerReadSeletedEventTemplate]'
})
export class SchedulerReadSeletedEventTemplateDirective {
  constructor(@Self() public template: TemplateRef<any>) {
  }
}
