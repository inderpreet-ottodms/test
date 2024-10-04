import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpgradeAccountComponent } from './upgrade-account.component';

describe('UpgradeAccountComponent', () => {
  let component: UpgradeAccountComponent;
  let fixture: ComponentFixture<UpgradeAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
