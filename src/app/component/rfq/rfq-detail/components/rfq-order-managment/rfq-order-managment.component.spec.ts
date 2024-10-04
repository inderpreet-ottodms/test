import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqOrderManagmentComponent } from './rfq-order-managment.component';

describe('RfqOrderManagmentComponent', () => {
  let component: RfqOrderManagmentComponent;
  let fixture: ComponentFixture<RfqOrderManagmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqOrderManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqOrderManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
