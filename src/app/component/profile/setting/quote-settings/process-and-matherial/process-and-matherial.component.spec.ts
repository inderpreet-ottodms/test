import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProcessAndMatherialComponent } from './process-and-matherial.component';

describe('ProcessAndMatherialComponent', () => {
  let component: ProcessAndMatherialComponent;
  let fixture: ComponentFixture<ProcessAndMatherialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessAndMatherialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessAndMatherialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
