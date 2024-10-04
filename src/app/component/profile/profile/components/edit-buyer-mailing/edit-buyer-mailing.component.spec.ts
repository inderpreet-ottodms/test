import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBuyerMailingComponent } from './edit-buyer-mailing.component';

describe('EditBuyerMailingComponent', () => {
  let component: EditBuyerMailingComponent;
  let fixture: ComponentFixture<EditBuyerMailingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBuyerMailingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBuyerMailingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
