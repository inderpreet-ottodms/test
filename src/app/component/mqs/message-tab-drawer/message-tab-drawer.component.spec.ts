import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageTabDrawerComponent } from './message-tab-drawer.component';

describe('MessageTabDrawerComponent', () => {
  let component: MessageTabDrawerComponent;
  let fixture: ComponentFixture<MessageTabDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageTabDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTabDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
