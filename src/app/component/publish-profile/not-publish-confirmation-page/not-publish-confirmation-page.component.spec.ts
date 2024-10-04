import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotPublishConfirmationPageComponent } from './not-publish-confirmation-page.component';

describe('NotPublishConfirmationPageComponent', () => {
  let component: NotPublishConfirmationPageComponent;
  let fixture: ComponentFixture<NotPublishConfirmationPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotPublishConfirmationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotPublishConfirmationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
