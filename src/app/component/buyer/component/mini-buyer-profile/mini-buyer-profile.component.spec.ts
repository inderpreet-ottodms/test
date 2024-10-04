import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MiniBuyerProfileComponent } from './mini-buyer-profile.component';

describe('MiniBuyerProfileComponent', () => {
  let component: MiniBuyerProfileComponent;
  let fixture: ComponentFixture<MiniBuyerProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniBuyerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniBuyerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
