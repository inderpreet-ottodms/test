import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqQuotesComponent } from './rfq-quotes.component';

describe('RfqQuotesComponent', () => {
  let component: RfqQuotesComponent;
  let fixture: ComponentFixture<RfqQuotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
