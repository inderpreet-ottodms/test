import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqRevisionsComponent } from './rfq-revisions.component';

describe('RfqRevisionsComponent', () => {
  let component: RfqRevisionsComponent;
  let fixture: ComponentFixture<RfqRevisionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqRevisionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqRevisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
