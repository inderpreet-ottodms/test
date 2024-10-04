import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RfgInsightFilterComponent } from './rfg-insight-filter.component';

describe('RfgInsightFilterComponent', () => {
  let component: RfgInsightFilterComponent;
  let fixture: ComponentFixture<RfgInsightFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RfgInsightFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfgInsightFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
