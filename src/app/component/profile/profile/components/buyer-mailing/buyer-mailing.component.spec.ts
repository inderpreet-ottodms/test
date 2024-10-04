import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerMailingComponent } from './buyer-mailing.component';

describe('BuyerMailingComponent', () => {
  let component: BuyerMailingComponent;
  let fixture: ComponentFixture<BuyerMailingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerMailingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerMailingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
