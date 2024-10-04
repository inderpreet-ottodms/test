import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqQuotePdfComponent } from './rfq-quote-pdf.component';

describe('RfqQuotePdfComponent', () => {
  let component: RfqQuotePdfComponent;
  let fixture: ComponentFixture<RfqQuotePdfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqQuotePdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqQuotePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
