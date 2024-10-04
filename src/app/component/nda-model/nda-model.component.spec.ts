import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NdaModelComponent } from './nda-model.component';

describe('NdaModelComponent', () => {
  let component: NdaModelComponent;
  let fixture: ComponentFixture<NdaModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NdaModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdaModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
