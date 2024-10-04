import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageSendNewDrawerComponent } from './message-send-new-drawer.component';

describe('MessageSendNewDrawerComponent', () => {
  let component: MessageSendNewDrawerComponent;
  let fixture: ComponentFixture<MessageSendNewDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSendNewDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSendNewDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
