import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageSendDrawerComponent } from './message-send-drawer.component';

describe('MessageSendDrawerComponent', () => {
  let component: MessageSendDrawerComponent;
  let fixture: ComponentFixture<MessageSendDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSendDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSendDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
