import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqImageComponent } from './rfq-image.component';

describe('RfqImageComponent', () => {
  let component: RfqImageComponent;
  let fixture: ComponentFixture<RfqImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
