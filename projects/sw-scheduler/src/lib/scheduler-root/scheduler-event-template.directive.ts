import { Directive, TemplateRef, Self, Host, OnInit, OnDestroy} from '@angular/core';

import { SchedulerService} from '../scheduler.service';

@Directive({
  selector: '[schedulerEventTemplate]'
})
export class SchedulerEventTemplateDirective implements OnInit, OnDestroy {
  constructor(@Self() public template: TemplateRef<any>, @Host() private schedulerSvc: SchedulerService) {
  }

  ngOnInit() {
    this.schedulerSvc.addOrRemoveEventTemplate();
  }

  ngOnDestroy() {
    this.schedulerSvc.addOrRemoveEventTemplate();
  }
}
