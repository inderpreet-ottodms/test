import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqPartQuestionsComponent } from './rfq-part-questions.component';

describe('RfqPartQuestionsComponent', () => {
  let component: RfqPartQuestionsComponent;
  let fixture: ComponentFixture<RfqPartQuestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqPartQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqPartQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
