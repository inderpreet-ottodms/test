import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerContactListComponent } from './buyer-contact-list.component';

describe('BuyerContactListComponent', () => {
  let component: BuyerContactListComponent;
  let fixture: ComponentFixture<BuyerContactListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerContactListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
