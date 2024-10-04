import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultiselectRfqsComponent } from './multiselect-rfqs.component';

describe('MultiselectRfqsComponent', () => {
  let component: MultiselectRfqsComponent;
  let fixture: ComponentFixture<MultiselectRfqsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiselectRfqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectRfqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
