import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionExpireModelComponent } from './session-expire-model.component';

describe('SessionExpireModelComponent', () => {
  let component: SessionExpireModelComponent;
  let fixture: ComponentFixture<SessionExpireModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionExpireModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpireModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
