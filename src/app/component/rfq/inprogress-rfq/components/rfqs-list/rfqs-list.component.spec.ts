import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqsListComponent } from './rfqs-list.component';

describe('RfqsListComponent', () => {
  let component: RfqsListComponent;
  let fixture: ComponentFixture<RfqsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
