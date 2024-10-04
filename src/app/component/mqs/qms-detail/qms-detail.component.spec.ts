import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmsDetailComponent } from './qms-detail.component';

describe('QmsDetailComponent', () => {
  let component: QmsDetailComponent;
  let fixture: ComponentFixture<QmsDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
