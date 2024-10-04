import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupRfqShopiqComponent } from './sup-rfq-shopiq.component';

describe('SupRfqShopiqComponent', () => {
  let component: SupRfqShopiqComponent;
  let fixture: ComponentFixture<SupRfqShopiqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupRfqShopiqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupRfqShopiqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
