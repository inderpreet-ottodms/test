import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockedRfqComponent } from './unlocked-rfq.component';

describe('UnlockedRfqComponent', () => {
  let component: UnlockedRfqComponent;
  let fixture: ComponentFixture<UnlockedRfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockedRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockedRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
