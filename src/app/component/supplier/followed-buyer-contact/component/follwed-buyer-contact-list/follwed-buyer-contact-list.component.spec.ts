import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FollwedBuyerContactListComponent } from './follwed-buyer-contact-list.component';

describe('FollwedBuyerContactListComponent', () => {
  let component: FollwedBuyerContactListComponent;
  let fixture: ComponentFixture<FollwedBuyerContactListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FollwedBuyerContactListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollwedBuyerContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
