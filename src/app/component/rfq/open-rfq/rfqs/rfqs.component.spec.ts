import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqsComponent } from './rfqs.component';

describe('RfqsComponent', () => {
  let component: RfqsComponent;
  let fixture: ComponentFixture<RfqsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
