import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditContactUsComponent } from './edit-contact-us.component';

describe('EditContactUsComponent', () => {
  let component: EditContactUsComponent;
  let fixture: ComponentFixture<EditContactUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContactUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
