import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonNotificationComponent } from './common-notification.component';

describe('CommonNotificationComponent', () => {
  let component: CommonNotificationComponent;
  let fixture: ComponentFixture<CommonNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
