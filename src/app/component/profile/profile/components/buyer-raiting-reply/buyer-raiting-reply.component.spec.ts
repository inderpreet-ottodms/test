import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerRaitingReplyComponent } from './buyer-raiting-reply.component';

describe('BuyerRaitingReplyComponent', () => {
  let component: BuyerRaitingReplyComponent;
  let fixture: ComponentFixture<BuyerRaitingReplyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerRaitingReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerRaitingReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
