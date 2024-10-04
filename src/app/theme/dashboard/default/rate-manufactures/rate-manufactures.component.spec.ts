import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RateManufacturesComponent } from './rate-manufactures.component';

describe('RateManufacturesComponent', () => {
  let component: RateManufacturesComponent;
  let fixture: ComponentFixture<RateManufacturesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RateManufacturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateManufacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
