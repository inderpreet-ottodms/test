import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonInvoiceComponent } from './common-invoice.component';

describe('CommonInvoiceComponent', () => {
  let component: CommonInvoiceComponent;
  let fixture: ComponentFixture<CommonInvoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
