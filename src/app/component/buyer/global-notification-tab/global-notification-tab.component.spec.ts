import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalNotificationTabComponent } from './global-notification-tab.component';

describe('GlobalNotificationTabComponent', () => {
  let component: GlobalNotificationTabComponent;
  let fixture: ComponentFixture<GlobalNotificationTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalNotificationTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalNotificationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
