import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpgradeToSilverComponent } from './upgrade-to-silver.component';

describe('UpgradeToSilverComponent', () => {
  let component: UpgradeToSilverComponent;
  let fixture: ComponentFixture<UpgradeToSilverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeToSilverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeToSilverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
