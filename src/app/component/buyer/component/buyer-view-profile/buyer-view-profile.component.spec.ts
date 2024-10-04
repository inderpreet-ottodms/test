import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerViewProfileComponent } from './buyer-view-profile.component';

describe('BuyerViewProfileComponent', () => {
  let component: BuyerViewProfileComponent;
  let fixture: ComponentFixture<BuyerViewProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerViewProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
