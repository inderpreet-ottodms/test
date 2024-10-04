import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupplierViewsComponent } from './supplier-views.component';

describe('SupplierViewsComponent', () => {
  let component: SupplierViewsComponent;
  let fixture: ComponentFixture<SupplierViewsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
