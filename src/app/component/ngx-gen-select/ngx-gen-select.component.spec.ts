import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxGenSelectComponent } from './ngx-gen-select.component';

describe('NgxGenSelectComponent', () => {
  let component: NgxGenSelectComponent;
  let fixture: ComponentFixture<NgxGenSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxGenSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGenSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
