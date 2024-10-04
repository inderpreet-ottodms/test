import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoiceTabComponent } from './invoice-tab.component';

describe('InvoiceTabComponent', () => {
  let component: InvoiceTabComponent;
  let fixture: ComponentFixture<InvoiceTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
