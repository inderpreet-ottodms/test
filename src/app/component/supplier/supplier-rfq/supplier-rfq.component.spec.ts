import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupplierRfqComponent } from './supplier-rfq.component';

describe('SupplierRfqComponent', () => {
  let component: SupplierRfqComponent;
  let fixture: ComponentFixture<SupplierRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
