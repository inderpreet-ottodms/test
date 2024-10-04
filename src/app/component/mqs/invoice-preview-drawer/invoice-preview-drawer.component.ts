import { Component, OnInit } from '@angular/core';
import { QmsService } from '../../../core/services/qms/qms.service';

@Component({
  selector: 'app-invoice-preview-drawer',
  templateUrl: './invoice-preview-drawer.component.html',
  styleUrls: ['./invoice-preview-drawer.component.scss']
})
export class InvoicePreviewDrawerComponent implements OnInit {

  constructor(private _qmsService: QmsService) { }

  ngOnInit() {
  }
  closeQuoteReviewDrawer(){
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isQuoteReviewDrawer');
  }
}
