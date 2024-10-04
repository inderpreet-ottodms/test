import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsRedirectComponent } from './materials-redirect.component';

describe('MaterialsRedirectComponent', () => {
  let component: MaterialsRedirectComponent;
  let fixture: ComponentFixture<MaterialsRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
