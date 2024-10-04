import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCapabilitiesComponent } from './edit-capabilities.component';

describe('EditCapabilitiesComponent', () => {
  let component: EditCapabilitiesComponent;
  let fixture: ComponentFixture<EditCapabilitiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCapabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCapabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
