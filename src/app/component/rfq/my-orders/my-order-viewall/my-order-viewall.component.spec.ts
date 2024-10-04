import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { myOrderViewAllComponent } from './my-order-viewall.component';

describe('myOrderViewAllComponent', () => {
  let component: myOrderViewAllComponent;
  let fixture: ComponentFixture<myOrderViewAllComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ myOrderViewAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(myOrderViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
