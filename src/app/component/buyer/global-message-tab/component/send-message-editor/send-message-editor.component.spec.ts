import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SendMessageEditorComponent } from './send-message-editor.component';

describe('SendMessageEditorComponent', () => {
  let component: SendMessageEditorComponent;
  let fixture: ComponentFixture<SendMessageEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMessageEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMessageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
