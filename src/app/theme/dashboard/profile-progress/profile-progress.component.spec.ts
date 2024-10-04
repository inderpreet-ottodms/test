import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileProgressComponent } from './profile-progress.component';

describe('ProfileProgressComponent', () => {
  let component: ProfileProgressComponent;
  let fixture: ComponentFixture<ProfileProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
