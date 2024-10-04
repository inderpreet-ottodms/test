import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewSupplierRfqDetailSidepanelComponent } from './new-rfq-detail-sidepanel.component';

describe('NewSupplierRfqDetailSidepanelComponent', () => {
  let component: NewSupplierRfqDetailSidepanelComponent;
  let fixture: ComponentFixture<NewSupplierRfqDetailSidepanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSupplierRfqDetailSidepanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSupplierRfqDetailSidepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
