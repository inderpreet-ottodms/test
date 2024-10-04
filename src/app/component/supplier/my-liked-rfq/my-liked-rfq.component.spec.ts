import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyLikedRfqComponent } from './my-liked-rfq.component';

describe('MyLikedRfqComponent', () => {
  let component: MyLikedRfqComponent;
  let fixture: ComponentFixture<MyLikedRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyLikedRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLikedRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
