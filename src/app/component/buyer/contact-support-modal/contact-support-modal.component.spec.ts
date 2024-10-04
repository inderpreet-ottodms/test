import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactSupportModalComponent } from './contact-support-modal.component';

describe('ContactSupportModalComponent', () => {
  let component: ContactSupportModalComponent;
  let fixture: ComponentFixture<ContactSupportModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactSupportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSupportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
