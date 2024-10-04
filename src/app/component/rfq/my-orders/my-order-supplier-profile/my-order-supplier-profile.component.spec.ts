import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { myOrderSupplierProfileComponent } from './my-order-supplier-profile.component';

describe('myOrderSupplierProfileComponent', () => {
  let component: myOrderSupplierProfileComponent;
  let fixture: ComponentFixture<myOrderSupplierProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ myOrderSupplierProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(myOrderSupplierProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
