import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotesTabDrawerComponent } from './notes-tab-drawer.component';

describe('NotesTabDrawerComponent', () => {
  let component: NotesTabDrawerComponent;
  let fixture: ComponentFixture<NotesTabDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesTabDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesTabDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
