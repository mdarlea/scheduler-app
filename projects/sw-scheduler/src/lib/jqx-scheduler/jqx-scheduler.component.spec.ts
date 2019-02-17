import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JqxSchedulerComponent } from './jqx-scheduler.component';

describe('JqxSchedulerComponent', () => {
  let component: JqxSchedulerComponent;
  let fixture: ComponentFixture<JqxSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JqxSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JqxSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
