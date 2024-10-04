import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageViewDrawerComponent } from './message-view-drawer.component';

describe('MessageViewDrawerComponent', () => {
  let component: MessageViewDrawerComponent;
  let fixture: ComponentFixture<MessageViewDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageViewDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageViewDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
