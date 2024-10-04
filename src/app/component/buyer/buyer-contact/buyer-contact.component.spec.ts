import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerContactComponent } from './buyer-contact.component';

describe('BuyerContactComponent', () => {
  let component: BuyerContactComponent;
  let fixture: ComponentFixture<BuyerContactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
