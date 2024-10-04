import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfqNdaComponent } from './rfq-nda.component';

describe('RfqNdaComponent', () => {
  let component: RfqNdaComponent;
  let fixture: ComponentFixture<RfqNdaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqNdaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqNdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
