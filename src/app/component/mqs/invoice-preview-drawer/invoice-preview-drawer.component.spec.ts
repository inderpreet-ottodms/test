import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoicePreviewDrawerComponent } from './invoice-preview-drawer.component';

describe('InvoicePreviewDrawerComponent', () => {
  let component: InvoicePreviewDrawerComponent;
  let fixture: ComponentFixture<InvoicePreviewDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePreviewDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePreviewDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
