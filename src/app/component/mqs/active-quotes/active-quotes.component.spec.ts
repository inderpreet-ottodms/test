import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveQuotesComponent } from './active-quotes.component';

describe('ActiveQuotesComponent', () => {
  let component: ActiveQuotesComponent;
  let fixture: ComponentFixture<ActiveQuotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
