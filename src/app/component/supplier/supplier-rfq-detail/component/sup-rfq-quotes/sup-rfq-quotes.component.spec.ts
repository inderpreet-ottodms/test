import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupRfqQuotesComponent } from './sup-rfq-quotes.component';

describe('SupRfqQuotesComponent', () => {
  let component: SupRfqQuotesComponent;
  let fixture: ComponentFixture<SupRfqQuotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupRfqQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupRfqQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
