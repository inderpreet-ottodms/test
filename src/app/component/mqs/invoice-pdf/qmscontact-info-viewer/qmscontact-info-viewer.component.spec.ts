import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QmscontactInfoViewerComponent } from './qmscontact-info-viewer.component';

describe('QmscontactInfoViewerComponent', () => {
  let component: QmscontactInfoViewerComponent;
  let fixture: ComponentFixture<QmscontactInfoViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmscontactInfoViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmscontactInfoViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
