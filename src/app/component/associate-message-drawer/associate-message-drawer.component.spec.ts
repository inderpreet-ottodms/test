import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssociateMessageDrawerComponent } from './associate-message-drawer.component';

describe('AssociateMessageDrawerComponent', () => {
  let component: AssociateMessageDrawerComponent;
  let fixture: ComponentFixture<AssociateMessageDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateMessageDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateMessageDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
