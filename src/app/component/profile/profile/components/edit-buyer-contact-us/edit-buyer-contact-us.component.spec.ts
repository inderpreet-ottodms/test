import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBuyerContactUsComponent } from './edit-buyer-contact-us.component';

describe('EditBuyerContactUsComponent', () => {
  let component: EditBuyerContactUsComponent;
  let fixture: ComponentFixture<EditBuyerContactUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBuyerContactUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBuyerContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
