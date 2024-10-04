import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqCapabilityComponent } from './rfq-capability.component';

describe('RfqCapabilityComponent', () => {
  let component: RfqCapabilityComponent;
  let fixture: ComponentFixture<RfqCapabilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqCapabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqCapabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
