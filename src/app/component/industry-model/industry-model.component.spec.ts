import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndustryModelComponent } from './industry-model.component';

describe('IndustryModelComponent', () => {
  let component: IndustryModelComponent;
  let fixture: ComponentFixture<IndustryModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
