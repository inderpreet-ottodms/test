import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageRfqComponent } from './message-rfq.component';

describe('MessageRfqComponent', () => {
  let component: MessageRfqComponent;
  let fixture: ComponentFixture<MessageRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
