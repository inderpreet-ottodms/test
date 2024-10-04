import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqAwardModelComponent } from './rfq-award-model.component';

describe('RfqAwardModelComponent', () => {
  let component: RfqAwardModelComponent;
  let fixture: ComponentFixture<RfqAwardModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqAwardModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqAwardModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
