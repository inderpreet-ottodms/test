import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyCompanyInvoicesComponent } from './my-company-invoices.component';

describe('MyCompanyInvoicesComponent', () => {
  let component: MyCompanyInvoicesComponent;
  let fixture: ComponentFixture<MyCompanyInvoicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCompanyInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCompanyInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
