import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyMqsquoteComponent } from './my-mqsquote.component';

describe('MyMqsquoteComponent', () => {
  let component: MyMqsquoteComponent;
  let fixture: ComponentFixture<MyMqsquoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMqsquoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMqsquoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
