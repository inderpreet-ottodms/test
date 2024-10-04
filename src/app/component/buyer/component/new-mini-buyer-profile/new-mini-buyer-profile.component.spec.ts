import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewMiniBuyerProfileComponent } from './new-mini-buyer-profile.component';

describe('NewMiniBuyerProfileComponent', () => {
  let component: NewMiniBuyerProfileComponent;
  let fixture: ComponentFixture<NewMiniBuyerProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMiniBuyerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMiniBuyerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
