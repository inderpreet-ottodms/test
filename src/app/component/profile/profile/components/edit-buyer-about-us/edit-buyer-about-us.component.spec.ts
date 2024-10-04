import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBuyerAboutUsComponent } from './edit-buyer-about-us.component';

describe('EditBuyerAboutUsComponent', () => {
  let component: EditBuyerAboutUsComponent;
  let fixture: ComponentFixture<EditBuyerAboutUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBuyerAboutUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBuyerAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
