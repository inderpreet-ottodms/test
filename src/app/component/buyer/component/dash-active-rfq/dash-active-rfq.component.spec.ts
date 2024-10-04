import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashActiveRfqComponent } from './dash-active-rfq.component';

describe('DashActiveRfqComponent', () => {
  let component: DashActiveRfqComponent;
  let fixture: ComponentFixture<DashActiveRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashActiveRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashActiveRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
