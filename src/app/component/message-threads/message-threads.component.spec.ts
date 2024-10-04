import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageThreadsComponent } from './message-threads.component';

describe('MessageThreadsComponent', () => {
  let component: MessageThreadsComponent;
  let fixture: ComponentFixture<MessageThreadsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageThreadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageThreadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
