import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasicLoginComponent } from './basic-login.component';

describe('BasicLoginComponent', () => {
  let component: BasicLoginComponent;
  let fixture: ComponentFixture<BasicLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
