import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QoutesRfqListComponent } from './qoutes-rfq-list.component';

describe('QoutesRfqListComponent', () => {
  let component: QoutesRfqListComponent;
  let fixture: ComponentFixture<QoutesRfqListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QoutesRfqListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QoutesRfqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
