import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyQuoteComponent } from './my-quote.component';

describe('MyQuotesComponent', () => {
  let component: MyQuoteComponent;
  let fixture: ComponentFixture<MyQuoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
