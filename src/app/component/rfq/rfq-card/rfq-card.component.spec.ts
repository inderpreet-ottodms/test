import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqCardComponent } from './rfq-card.component';

describe('RfqCardComponent', () => {
  let component: RfqCardComponent;
  let fixture: ComponentFixture<RfqCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
