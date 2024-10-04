import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupRfqTransferComponent } from './sup-rfq-transfer.component';

describe('SupRfqTransferComponent', () => {
  let component: SupRfqTransferComponent;
  let fixture: ComponentFixture<SupRfqTransferComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupRfqTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupRfqTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
