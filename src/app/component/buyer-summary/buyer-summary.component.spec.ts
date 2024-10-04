import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerSummaryComponent } from './buyer-summary.component';

describe('BuyerSummaryComponent', () => {
  let component: BuyerSummaryComponent;
  let fixture: ComponentFixture<BuyerSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
