import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuotesInProgresComponent } from './quotes-in-progres.component';

describe('QuotesInProgresComponent', () => {
  let component: QuotesInProgresComponent;
  let fixture: ComponentFixture<QuotesInProgresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesInProgresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesInProgresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
