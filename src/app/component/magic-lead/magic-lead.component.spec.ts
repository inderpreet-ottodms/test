import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MagicLeadComponent } from './magic-lead.component';

describe('MagicLeadComponent', () => {
  let component: MagicLeadComponent;
  let fixture: ComponentFixture<MagicLeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
