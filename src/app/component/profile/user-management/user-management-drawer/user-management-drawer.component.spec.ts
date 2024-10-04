import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserManagementDrawerComponent } from './user-management-drawer.component';

describe('UserManagementDrawerComponent', () => {
  let component: UserManagementDrawerComponent;
  let fixture: ComponentFixture<UserManagementDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManagementDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
