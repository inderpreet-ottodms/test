import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuoteReviewDrawerComponent } from './quote-review-drawer.component';

describe('QuoteReviewDrawerComponent', () => {
  let component: QuoteReviewDrawerComponent;
  let fixture: ComponentFixture<QuoteReviewDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteReviewDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteReviewDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
