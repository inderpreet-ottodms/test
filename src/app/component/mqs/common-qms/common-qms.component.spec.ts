import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonQmsComponent } from './common-qms.component';

describe('CommonQmsComponent', () => {
  let component: CommonQmsComponent;
  let fixture: ComponentFixture<CommonQmsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonQmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonQmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
