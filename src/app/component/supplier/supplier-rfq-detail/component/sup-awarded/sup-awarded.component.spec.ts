import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupAwardedComponent } from './sup-awarded.component';

describe('SupAwardedComponent', () => {
  let component: SupAwardedComponent;
  let fixture: ComponentFixture<SupAwardedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupAwardedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupAwardedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
