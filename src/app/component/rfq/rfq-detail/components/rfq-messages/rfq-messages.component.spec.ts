import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqMessagesComponent } from './rfq-messages.component';

describe('RfqMessagesComponent', () => {
  let component: RfqMessagesComponent;
  let fixture: ComponentFixture<RfqMessagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
