import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NdaListComponent } from './nda-list.component';

describe('NdaListComponent', () => {
  let component: NdaListComponent;
  let fixture: ComponentFixture<NdaListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NdaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
