import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelineTabComponent } from './timeline-tab.component';

describe('TimelineTabComponent', () => {
  let component: TimelineTabComponent;
  let fixture: ComponentFixture<TimelineTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
