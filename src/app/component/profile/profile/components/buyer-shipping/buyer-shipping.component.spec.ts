import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerShippingComponent } from './buyer-shipping.component';

describe('BuyerShippingComponent', () => {
  let component: BuyerShippingComponent;
  let fixture: ComponentFixture<BuyerShippingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
