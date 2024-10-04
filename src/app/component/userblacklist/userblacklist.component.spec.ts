import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserblacklistComponent } from './userblacklist.component';

describe('UserblacklistComponent', () => {
  let component: UserblacklistComponent;
  let fixture: ComponentFixture<UserblacklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserblacklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserblacklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
