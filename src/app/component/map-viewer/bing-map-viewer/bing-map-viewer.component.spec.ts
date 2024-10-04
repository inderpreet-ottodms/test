import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BingMapViewerComponent } from './bing-map-viewer.component';

describe('BingMapViewerComponent', () => {
  let component: BingMapViewerComponent;
  let fixture: ComponentFixture<BingMapViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BingMapViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BingMapViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
