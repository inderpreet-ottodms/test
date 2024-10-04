import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqWarningBannerComponent } from './rfq-warning-banner.component';

describe('RfqWarningBannerComponent', () => {
  let component: RfqWarningBannerComponent;
  let fixture: ComponentFixture<RfqWarningBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqWarningBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqWarningBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
