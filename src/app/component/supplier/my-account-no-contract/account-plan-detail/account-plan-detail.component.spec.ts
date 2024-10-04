import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountPlanDetailComponent } from './account-plan-detail.component';

describe('AccountPlanDetailComponent', () => {
  let component: AccountPlanDetailComponent;
  let fixture: ComponentFixture<AccountPlanDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPlanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
