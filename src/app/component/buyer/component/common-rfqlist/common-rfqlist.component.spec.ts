import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonRfqlistComponent } from './common-rfqlist.component';

describe('CommonRfqlistComponent', () => {
  let component: CommonRfqlistComponent;
  let fixture: ComponentFixture<CommonRfqlistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonRfqlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonRfqlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
