import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeadMessageViewComponent } from './lead-message-view.component';

describe('LeadMessageViewComponent', () => {
  let component: LeadMessageViewComponent;
  let fixture: ComponentFixture<LeadMessageViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadMessageViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadMessageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
