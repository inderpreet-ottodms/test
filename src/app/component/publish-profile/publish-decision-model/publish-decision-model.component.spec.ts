import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublishDecisionModelComponent } from './publish-decision-model.component';

describe('PublishDecisionModelComponent', () => {
  let component: PublishDecisionModelComponent;
  let fixture: ComponentFixture<PublishDecisionModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishDecisionModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishDecisionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
