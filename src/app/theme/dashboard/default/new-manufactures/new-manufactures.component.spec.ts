import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewManufacturesComponent } from './new-manufactures.component';

describe('NewManufacturesComponent', () => {
  let component: NewManufacturesComponent;
  let fixture: ComponentFixture<NewManufacturesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewManufacturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewManufacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
