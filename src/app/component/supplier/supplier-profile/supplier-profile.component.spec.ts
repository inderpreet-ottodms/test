import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupplierProfileComponent } from './supplier-profile.component';

describe('SupplierProfileComponent', () => {
  let component: SupplierProfileComponent;
  let fixture: ComponentFixture<SupplierProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
