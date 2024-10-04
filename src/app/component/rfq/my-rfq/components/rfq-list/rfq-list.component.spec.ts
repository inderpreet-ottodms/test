import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqListComponent } from './rfq-list.component';

describe('RfqListComponent', () => {
  let component: RfqListComponent;
  let fixture: ComponentFixture<RfqListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
