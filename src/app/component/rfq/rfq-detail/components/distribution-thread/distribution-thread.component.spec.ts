import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DistributionThreadComponent } from './distribution-thread.component';

describe('DistributionThreadComponent', () => {
  let component: DistributionThreadComponent;
  let fixture: ComponentFixture<DistributionThreadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
