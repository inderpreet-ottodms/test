import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqTabComponent } from './rfq-tab.component';

describe('RfqTabComponent', () => {
  let component: RfqTabComponent;
  let fixture: ComponentFixture<RfqTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
