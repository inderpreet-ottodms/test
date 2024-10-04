import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GetLoggingComponent } from './get-logging.component';

describe('GetLoggingComponent', () => {
  let component: GetLoggingComponent;
  let fixture: ComponentFixture<GetLoggingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GetLoggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetLoggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
