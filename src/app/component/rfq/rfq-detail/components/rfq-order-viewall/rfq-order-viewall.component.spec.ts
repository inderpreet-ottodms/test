import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqOrderViewAllComponent } from './rfq-order-viewall.component';

describe('RfqOrderViewAllComponent', () => {
  let component: RfqOrderViewAllComponent;
  let fixture: ComponentFixture<RfqOrderViewAllComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqOrderViewAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqOrderViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
