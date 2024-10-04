import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmsInvoiceSpecialFeeComponent } from './qms-invoice-special-fee.component';

describe('QmsInvoiceSpecialFeeComponent', () => {
  let component: QmsInvoiceSpecialFeeComponent;
  let fixture: ComponentFixture<QmsInvoiceSpecialFeeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmsInvoiceSpecialFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmsInvoiceSpecialFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
