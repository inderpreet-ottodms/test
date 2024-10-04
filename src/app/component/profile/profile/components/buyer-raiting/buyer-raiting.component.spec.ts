import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerRaitingComponent } from './buyer-raiting.component';

describe('BuyerRaitingComponent', () => {
  let component: BuyerRaitingComponent;
  let fixture: ComponentFixture<BuyerRaitingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerRaitingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerRaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
