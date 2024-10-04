import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AwardOrderManagmentComponentQuoteRfqList } from './award-order-mangment.component';

describe('AwardOrderManagmentComponentQuoteRfqList', () => {
  let component: AwardOrderManagmentComponentQuoteRfqList;
  let fixture: ComponentFixture<AwardOrderManagmentComponentQuoteRfqList>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardOrderManagmentComponentQuoteRfqList ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardOrderManagmentComponentQuoteRfqList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
