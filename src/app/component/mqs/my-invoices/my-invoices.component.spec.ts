import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyInvoicesComponent } from './my-invoices.component';

describe('MyInvoicesComponent', () => {
  let component: MyInvoicesComponent;
  let fixture: ComponentFixture<MyInvoicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
