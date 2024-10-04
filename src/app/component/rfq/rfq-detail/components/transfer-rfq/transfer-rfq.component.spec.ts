import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransferRfqComponent } from './transfer-rfq.component';

describe('TransferRfqComponent', () => {
  let component: TransferRfqComponent;
  let fixture: ComponentFixture<TransferRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
