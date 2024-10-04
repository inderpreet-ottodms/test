import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyCompanyRfqComponent } from './my-company-rfq.component';

describe('MyCompanyRfqComponent', () => {
  let component: MyCompanyRfqComponent;
  let fixture: ComponentFixture<MyCompanyRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCompanyRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCompanyRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
