import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupRfqDetailComponent } from './sup-rfq-detail.component';

describe('SupRfqDetailComponent', () => {
  let component: SupRfqDetailComponent;
  let fixture: ComponentFixture<SupRfqDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupRfqDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupRfqDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
