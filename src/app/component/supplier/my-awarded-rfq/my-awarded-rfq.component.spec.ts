import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyAwardedRfqComponent } from './my-awarded-rfq.component';

describe('MyAwardedRfqComponent', () => {
  let component: MyAwardedRfqComponent;
  let fixture: ComponentFixture<MyAwardedRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAwardedRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAwardedRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
