import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotPublishDecisionModelComponent } from './not-publish-decision-model.component';

describe('NotPublishDecisionModelComponent', () => {
  let component: NotPublishDecisionModelComponent;
  let fixture: ComponentFixture<NotPublishDecisionModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotPublishDecisionModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotPublishDecisionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
