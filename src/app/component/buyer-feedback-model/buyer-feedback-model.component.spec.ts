import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerFeedbackModelComponent } from './buyer-feedback-model.component';

describe('BuyerFeedbackModelComponent', () => {
  let component: BuyerFeedbackModelComponent;
  let fixture: ComponentFixture<BuyerFeedbackModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerFeedbackModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerFeedbackModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
