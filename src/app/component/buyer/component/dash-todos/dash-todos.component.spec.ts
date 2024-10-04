import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashTodosComponent } from './dash-todos.component';

describe('DashTodosComponent', () => {
  let component: DashTodosComponent;
  let fixture: ComponentFixture<DashTodosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashTodosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
