import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashNewQuotesComponent } from './dash-new-quotes.component';

describe('DashNewQuotesComponent', () => {
  let component: DashNewQuotesComponent;
  let fixture: ComponentFixture<DashNewQuotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashNewQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashNewQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
