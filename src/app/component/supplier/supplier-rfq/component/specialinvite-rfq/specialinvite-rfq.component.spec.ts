import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpecialinviteRfqComponent } from './specialinvite-rfq.component';

describe('SpecialinviteRfqComponent', () => {
  let component: SpecialinviteRfqComponent;
  let fixture: ComponentFixture<SpecialinviteRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialinviteRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialinviteRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
