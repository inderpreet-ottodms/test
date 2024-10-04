import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupFilesComponent } from './sup-files.component';

describe('SupFilesComponent', () => {
  let component: SupFilesComponent;
  let fixture: ComponentFixture<SupFilesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
