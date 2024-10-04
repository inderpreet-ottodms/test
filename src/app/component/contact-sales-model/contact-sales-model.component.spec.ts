import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactSalesModelComponent } from './contact-sales-model.component';

describe('ContactSalesModelComponent', () => {
  let component: ContactSalesModelComponent;
  let fixture: ComponentFixture<ContactSalesModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactSalesModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSalesModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
