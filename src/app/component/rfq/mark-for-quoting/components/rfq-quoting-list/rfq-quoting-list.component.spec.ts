import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqQuotingListComponent } from './rfq-quoting-list.component';

describe('RfqQuotingListComponent', () => {
  let component: RfqQuotingListComponent;
  let fixture: ComponentFixture<RfqQuotingListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqQuotingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqQuotingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
