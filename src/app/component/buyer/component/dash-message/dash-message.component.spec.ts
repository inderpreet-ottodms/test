import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashMessageComponent } from './dash-message.component';

describe('DashMessageComponent', () => {
  let component: DashMessageComponent;
  let fixture: ComponentFixture<DashMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
