import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PagetitleQuotebtnComponent } from './pagetitle-quotebtn.component';

describe('PagetitleQuotebtnComponent', () => {
  let component: PagetitleQuotebtnComponent;
  let fixture: ComponentFixture<PagetitleQuotebtnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PagetitleQuotebtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagetitleQuotebtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
