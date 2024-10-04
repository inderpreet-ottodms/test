import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkInLoggingProcessComponent } from './link-in-logging-process.component';

describe('LinkInLoggingProcessComponent', () => {
  let component: LinkInLoggingProcessComponent;
  let fixture: ComponentFixture<LinkInLoggingProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkInLoggingProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkInLoggingProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
