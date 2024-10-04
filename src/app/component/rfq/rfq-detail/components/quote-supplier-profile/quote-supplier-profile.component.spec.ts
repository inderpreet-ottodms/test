import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuoteSupplierProfileComponent } from './quote-supplier-profile.component';

describe('QuoteSupplierProfileComponent', () => {
  let component: QuoteSupplierProfileComponent;
  let fixture: ComponentFixture<QuoteSupplierProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteSupplierProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteSupplierProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
