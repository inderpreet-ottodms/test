import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerContactUsComponent } from './buyer-contact-us.component';

describe('BuyerContactUsComponent', () => {
  let component: BuyerContactUsComponent;
  let fixture: ComponentFixture<BuyerContactUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerContactUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
