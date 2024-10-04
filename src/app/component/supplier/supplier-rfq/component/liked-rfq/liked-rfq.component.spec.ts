import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LikedRfqComponent } from './liked-rfq.component';

describe('LikedRfqComponent', () => {
  let component: LikedRfqComponent;
  let fixture: ComponentFixture<LikedRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LikedRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
