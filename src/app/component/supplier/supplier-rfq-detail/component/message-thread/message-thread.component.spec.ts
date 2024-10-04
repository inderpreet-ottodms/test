import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageThreadComponent } from './message-thread.component';

describe('MessageThreadComponent', () => {
  let component: MessageThreadComponent;
  let fixture: ComponentFixture<MessageThreadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
