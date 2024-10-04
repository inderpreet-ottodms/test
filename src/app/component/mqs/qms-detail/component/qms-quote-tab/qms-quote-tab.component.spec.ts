import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmsQuoteTabComponent } from './qms-quote-tab.component';

describe('QmsQuoteTabComponent', () => {
  let component: QmsQuoteTabComponent;
  let fixture: ComponentFixture<QmsQuoteTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmsQuoteTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmsQuoteTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
