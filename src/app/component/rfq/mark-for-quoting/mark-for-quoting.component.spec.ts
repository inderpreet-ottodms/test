import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MarkForQuotingComponent } from './mark-for-quoting.component';

describe('MarkForQuotingComponent', () => {
  let component: MarkForQuotingComponent;
  let fixture: ComponentFixture<MarkForQuotingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkForQuotingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkForQuotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
