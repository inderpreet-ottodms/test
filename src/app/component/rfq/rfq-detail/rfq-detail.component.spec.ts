import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqDetailComponent } from './rfq-detail.component';

describe('RfqDetailComponent', () => {
  let component: RfqDetailComponent;
  let fixture: ComponentFixture<RfqDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
