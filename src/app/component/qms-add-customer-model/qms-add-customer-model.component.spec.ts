import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmsAddCustomerModelComponent } from './qms-add-customer-model.component';

describe('QmsAddCustomerModelComponent', () => {
  let component: QmsAddCustomerModelComponent;
  let fixture: ComponentFixture<QmsAddCustomerModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmsAddCustomerModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmsAddCustomerModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
