import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldErrorDisplayComponent } from './field-error-display.component';

describe('FieldErrorDisplayComponent', () => {
  let component: FieldErrorDisplayComponent;
  let fixture: ComponentFixture<FieldErrorDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldErrorDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldErrorDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
