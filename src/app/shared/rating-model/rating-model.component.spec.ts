import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RatingModelComponent } from './rating-model.component';

describe('RatingModelComponent', () => {
  let component: RatingModelComponent;
  let fixture: ComponentFixture<RatingModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
