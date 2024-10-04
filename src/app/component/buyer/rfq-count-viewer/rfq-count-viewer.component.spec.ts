import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqCountViewerComponent } from './rfq-count-viewer.component';

describe('RfqCountViewerComponent', () => {
  let component: RfqCountViewerComponent;
  let fixture: ComponentFixture<RfqCountViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqCountViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqCountViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
