import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupplierRfqDetailComponent } from './supplier-rfq-detail.component';

describe('SupplierRfqDetailComponent', () => {
  let component: SupplierRfqDetailComponent;
  let fixture: ComponentFixture<SupplierRfqDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierRfqDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierRfqDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
