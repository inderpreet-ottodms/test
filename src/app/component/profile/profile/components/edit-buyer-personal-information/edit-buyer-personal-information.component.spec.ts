import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBuyerPersonalInformationComponent } from './edit-buyer-personal-information.component';

describe('EditBuyerPersonalInformationComponent', () => {
  let component: EditBuyerPersonalInformationComponent;
  let fixture: ComponentFixture<EditBuyerPersonalInformationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBuyerPersonalInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBuyerPersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
