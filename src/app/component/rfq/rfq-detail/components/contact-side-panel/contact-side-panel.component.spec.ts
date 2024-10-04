import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactSidePanelComponent } from './contact-side-panel.component';

describe('ContactSidePanelComponent', () => {
  let component: ContactSidePanelComponent;
  let fixture: ComponentFixture<ContactSidePanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactSidePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
