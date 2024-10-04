import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupRfqMessagesComponent } from './sup-rfq-messages.component';

describe('SupRfqMessagesComponent', () => {
  let component: SupRfqMessagesComponent;
  let fixture: ComponentFixture<SupRfqMessagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupRfqMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupRfqMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
