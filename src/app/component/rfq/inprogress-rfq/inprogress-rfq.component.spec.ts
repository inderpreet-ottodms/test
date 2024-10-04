import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InprogressRfqComponent } from './inprogress-rfq.component';

describe('InprogressRfqComponent', () => {
  let component: InprogressRfqComponent;
  let fixture: ComponentFixture<InprogressRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InprogressRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InprogressRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
