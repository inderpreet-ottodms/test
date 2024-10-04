import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmsPdfComponent } from './qms-pdf.component';

describe('QmsPdfComponent', () => {
  let component: QmsPdfComponent;
  let fixture: ComponentFixture<QmsPdfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmsPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
