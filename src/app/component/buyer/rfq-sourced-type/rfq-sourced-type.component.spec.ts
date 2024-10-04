import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqSourcedTypeComponent } from './rfq-sourced-type.component';

describe('RfqSourcedTypeComponent', () => {
  let component: RfqSourcedTypeComponent;
  let fixture: ComponentFixture<RfqSourcedTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqSourcedTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqSourcedTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
