import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FollowedBuyerContactComponent } from './followed-buyer-contact.component';

describe('FollowedBuyerContactComponent', () => {
  let component: FollowedBuyerContactComponent;
  let fixture: ComponentFixture<FollowedBuyerContactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowedBuyerContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowedBuyerContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
