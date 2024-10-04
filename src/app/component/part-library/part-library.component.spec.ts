import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartLibraryComponent } from './part-library.component';

describe('PartLibraryComponent', () => {
  let component: PartLibraryComponent;
  let fixture: ComponentFixture<PartLibraryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
