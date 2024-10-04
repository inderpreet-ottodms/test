import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegionalAwardingModelComponent } from './regional-awarding-model.component';

describe('RegionalAwardingModelComponent', () => {
  let component: RegionalAwardingModelComponent;
  let fixture: ComponentFixture<RegionalAwardingModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionalAwardingModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionalAwardingModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
