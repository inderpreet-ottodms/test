import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AwardOrderManagmentComponent } from './award-order-mangment.component';

describe('AwardOrderManagmentComponent', () => {
  let component: AwardOrderManagmentComponent;
  let fixture: ComponentFixture<AwardOrderManagmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardOrderManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardOrderManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
