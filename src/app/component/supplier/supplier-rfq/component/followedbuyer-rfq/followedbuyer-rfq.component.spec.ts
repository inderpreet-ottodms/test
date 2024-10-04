import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FollowedbuyerRfqComponent } from './followedbuyer-rfq.component';

describe('FollowedbuyerRfqComponent', () => {
  let component: FollowedbuyerRfqComponent;
  let fixture: ComponentFixture<FollowedbuyerRfqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowedbuyerRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowedbuyerRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
