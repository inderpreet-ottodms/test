import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeadStreamComponent } from './lead-stream.component';

describe('LeadStreamComponent', () => {
  let component: LeadStreamComponent;
  let fixture: ComponentFixture<LeadStreamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
