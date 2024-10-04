import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartialQuotingComponent } from './partial-quoting.component';

describe('PartialQuotingComponent', () => {
  let component: PartialQuotingComponent;
  let fixture: ComponentFixture<PartialQuotingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartialQuotingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialQuotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
