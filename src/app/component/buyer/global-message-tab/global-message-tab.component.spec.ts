import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalMessageTabComponent } from './global-message-tab.component';

describe('GlobalMessageTabComponent', () => {
  let component: GlobalMessageTabComponent;
  let fixture: ComponentFixture<GlobalMessageTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalMessageTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalMessageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
