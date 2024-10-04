import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupplierViewProfileComponent } from './supplier-view-profile.component';

describe('SupplierViewProfileComponent', () => {
  let component: SupplierViewProfileComponent;
  let fixture: ComponentFixture<SupplierViewProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierViewProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
