import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoicePdfComponent } from './invoice-pdf.component';

describe('InvoicePdfComponent', () => {
  let component: InvoicePdfComponent;
  let fixture: ComponentFixture<InvoicePdfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
