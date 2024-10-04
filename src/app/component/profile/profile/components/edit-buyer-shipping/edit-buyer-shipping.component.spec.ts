import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBuyerShippingComponent } from './edit-buyer-shipping.component';

describe('EditBuyerShippingComponent', () => {
  let component: EditBuyerShippingComponent;
  let fixture: ComponentFixture<EditBuyerShippingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBuyerShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBuyerShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
