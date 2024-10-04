import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyCompanyQuotesComponent } from './my-company-quotes.component';

describe('MyCompanyQuotesComponent', () => {
  let component: MyCompanyQuotesComponent;
  let fixture: ComponentFixture<MyCompanyQuotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCompanyQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCompanyQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
