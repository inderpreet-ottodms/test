import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpgradeAccountBtnComponent } from './upgrade-account-btn.component';

describe('UpgradeAccountBtnComponent', () => {
  let component: UpgradeAccountBtnComponent;
  let fixture: ComponentFixture<UpgradeAccountBtnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeAccountBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeAccountBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
