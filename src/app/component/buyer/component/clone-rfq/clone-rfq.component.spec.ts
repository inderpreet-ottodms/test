import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CloneRfqComponent } from './clone-rfq.component';

describe('CloneRfqComponent', () => {
  let component: CloneRfqComponent;
  let fixture: ComponentFixture<CloneRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CloneRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
