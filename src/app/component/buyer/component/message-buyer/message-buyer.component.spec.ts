import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageBuyerComponent } from './message-buyer.component';

describe('MessageBuyerComponent', () => {
  let component: MessageBuyerComponent;
  let fixture: ComponentFixture<MessageBuyerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
