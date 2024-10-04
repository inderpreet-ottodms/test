import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TermsAndConditionsModelComponent } from './terms-and-conditions-model.component';

describe('TermsAndConditionsModelComponent', () => {
  let component: TermsAndConditionsModelComponent;
  let fixture: ComponentFixture<TermsAndConditionsModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
