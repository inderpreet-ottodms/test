import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyCustomerDrawerComponent } from './my-customer-drawer.component';

describe('MyCustomerDrawerComponent', () => {
  let component: MyCustomerDrawerComponent;
  let fixture: ComponentFixture<MyCustomerDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCustomerDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCustomerDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
