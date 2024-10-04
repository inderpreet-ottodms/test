import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerEngagementFlowComponent } from './buyer-engagement-flow.component';

describe('BuyerEngagementFlowComponent', () => {
  let component: BuyerEngagementFlowComponent;
  let fixture: ComponentFixture<BuyerEngagementFlowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerEngagementFlowComponent ]
    })
    .compileComponents();
  }));

  
  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerEngagementFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
