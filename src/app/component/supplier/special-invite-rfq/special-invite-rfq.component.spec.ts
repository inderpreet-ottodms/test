import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpecialInviteRfqComponent } from './special-invite-rfq.component';

describe('SpecialInviteRfqComponent', () => {
  let component: SpecialInviteRfqComponent;
  let fixture: ComponentFixture<SpecialInviteRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialInviteRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialInviteRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
