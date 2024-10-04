import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqInvoicesComponent } from './rfq-invoices.component';

describe('RfqInvoicesComponent', () => {
  let component: RfqInvoicesComponent;
  let fixture: ComponentFixture<RfqInvoicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
