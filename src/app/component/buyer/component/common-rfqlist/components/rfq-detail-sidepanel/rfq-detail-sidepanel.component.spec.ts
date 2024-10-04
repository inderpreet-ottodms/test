import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqDetailSidepanelComponent } from './rfq-detail-sidepanel.component';

describe('RfqDetailSidepanelComponent', () => {
  let component: RfqDetailSidepanelComponent;
  let fixture: ComponentFixture<RfqDetailSidepanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqDetailSidepanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqDetailSidepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
