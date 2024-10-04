import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QmsInvoicePartUpdateComponent } from './qms-invoice-part-update.component';

describe('QmsInvoicePartUpdateComponent', () => {
  let component: QmsInvoicePartUpdateComponent;
  let fixture: ComponentFixture<QmsInvoicePartUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QmsInvoicePartUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmsInvoicePartUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
