import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AwardRfqComponent } from './award-rfq.component';

describe('AwardRfqComponent', () => {
  let component: AwardRfqComponent;
  let fixture: ComponentFixture<AwardRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
