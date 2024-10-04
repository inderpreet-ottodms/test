import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerAboutUsComponent } from './buyer-about-us.component';

describe('BuyerAboutUsComponent', () => {
  let component: BuyerAboutUsComponent;
  let fixture: ComponentFixture<BuyerAboutUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerAboutUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
