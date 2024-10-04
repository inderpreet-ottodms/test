import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountInvoiceHistoryComponent } from './account-invoice-history.component';

describe('AccountInvoiceHistoryComponent', () => {
  let component: AccountInvoiceHistoryComponent;
  let fixture: ComponentFixture<AccountInvoiceHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountInvoiceHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInvoiceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
