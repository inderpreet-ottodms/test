import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPartDrawerComponent } from './edit-part-drawer.component';

describe('EditPartDrawerComponent', () => {
  let component: EditPartDrawerComponent;
  let fixture: ComponentFixture<EditPartDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPartDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPartDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
