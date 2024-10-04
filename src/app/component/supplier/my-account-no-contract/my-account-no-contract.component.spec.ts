import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyAccountNoContractComponent } from './my-account-no-contract.component';

describe('MyAccountNoContractComponent', () => {
  let component: MyAccountNoContractComponent;
  let fixture: ComponentFixture<MyAccountNoContractComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAccountNoContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountNoContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
