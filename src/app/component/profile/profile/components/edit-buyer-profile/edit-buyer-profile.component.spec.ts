import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBuyerProfileComponent } from './edit-buyer-profile.component';

describe('EditBuyerProfileComponent', () => {
  let component: EditBuyerProfileComponent;
  let fixture: ComponentFixture<EditBuyerProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBuyerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBuyerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
