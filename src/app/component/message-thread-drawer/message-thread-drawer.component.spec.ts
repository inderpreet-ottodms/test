import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageThreadDrawerComponent } from './message-thread-drawer.component';

describe('MessageThreadDrawerComponent', () => {
  let component: MessageThreadDrawerComponent;
  let fixture: ComponentFixture<MessageThreadDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageThreadDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageThreadDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
