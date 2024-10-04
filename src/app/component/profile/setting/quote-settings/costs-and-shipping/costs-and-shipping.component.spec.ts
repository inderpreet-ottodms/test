import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CostsAndShippingComponent } from './costs-and-shipping.component';

describe('CostsAndShippingComponent', () => {
  let component: CostsAndShippingComponent;
  let fixture: ComponentFixture<CostsAndShippingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CostsAndShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostsAndShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
