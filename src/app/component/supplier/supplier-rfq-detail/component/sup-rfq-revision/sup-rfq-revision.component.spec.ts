import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupRfqRevisionComponent } from './sup-rfq-revision.component';

describe('SupRfqRevisionComponent', () => {
  let component: SupRfqRevisionComponent;
  let fixture: ComponentFixture<SupRfqRevisionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupRfqRevisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupRfqRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
