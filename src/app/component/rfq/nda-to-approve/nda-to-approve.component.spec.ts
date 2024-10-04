import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NdaToApproveComponent } from './nda-to-approve.component';

describe('NdaToApproveComponent', () => {
  let component: NdaToApproveComponent;
  let fixture: ComponentFixture<NdaToApproveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NdaToApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdaToApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
