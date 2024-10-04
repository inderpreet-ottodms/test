import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NonMfgQuoteComponent } from './non-mfg-quote.component';

describe('NonMfgQuoteComponent', () => {
  let component: NonMfgQuoteComponent;
  let fixture: ComponentFixture<NonMfgQuoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NonMfgQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonMfgQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
