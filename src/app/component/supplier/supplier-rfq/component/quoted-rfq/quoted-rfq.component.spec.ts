import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuotedRfqComponent } from './quoted-rfq.component';

describe('QuotedRfqComponent', () => {
  let component: QuotedRfqComponent;
  let fixture: ComponentFixture<QuotedRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotedRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotedRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
