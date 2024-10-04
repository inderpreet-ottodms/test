import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FollwedBuyerRfqComponent } from './follwed-buyer-rfq.component';

describe('FollwedBuyerRfqComponent', () => {
  let component: FollwedBuyerRfqComponent;
  let fixture: ComponentFixture<FollwedBuyerRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FollwedBuyerRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollwedBuyerRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
