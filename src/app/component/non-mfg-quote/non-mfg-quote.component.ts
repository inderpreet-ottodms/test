import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  ToastrService
} from 'ngx-toastr';
import { ProductAnalyticService } from '../../,,/,,/,,/../../../../app/shared/product-analytic/product-analytic';
import {
  IRFQPartQuantityQuote
} from '../../core/models/rfqModel';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-non-mfg-quote',
  templateUrl: './non-mfg-quote.component.html',
  styleUrls: ['./non-mfg-quote.component.scss']
})
export class NonMfgQuoteComponent implements OnInit {

  showBlock: number = null;
  @Input('rfqId') rfqId: number;
  @Input('rfqStatus') rfqStatus: number;
  @Output() retractAwardEvent = new EventEmitter();
  @Output() dataAvailable = new EventEmitter();
  @ViewChild('content', { static: false }) errorCSVModal: TemplateRef<any>;
  modalReference: any
  quoteViewModel: any[];
  awardRFQPartQuantityQuote: IRFQPartQuantityQuote;
  rfqPartId: number = null;
  statusId: number = null;

  constructor(private _rfqService: RfqService, private modalService: NgbModal, private _toastr: ToastrService,private productAnalyticService:ProductAnalyticService) { }

  ngOnInit() {
    this.quoteViewModel = [];
    this._rfqService.stringSubject.subscribe(
      data => {
        this.getQuoteDetails();
      }
    );
    setTimeout(() => {
      this.getQuoteDetails();
    }, 1000)

  }
  getQuoteDetails() {
    this._rfqService.getQuoteDetails(this.rfqId).subscribe(
      response => {
        if (!response.isError) {
          this.quoteViewModel = response.data;
          this.dataAvailable.emit(this.quoteViewModel.length)
        }
      }
    );
  }
  retractAward(rfqPartId, statusId) {
    if (this.rfqStatus != 1 && this.rfqStatus != 2) {
      this.rfqPartId = rfqPartId;
      this.statusId = statusId;
      this.modalReference = this.modalService.open(this.errorCSVModal, {
        backdrop: 'static'
      });
    }
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_BUYER_RFQ_CANCELLED,{
      rfq_id: localStorage.getItem('RfqId'),
      rfq_count: localStorage.getItem('submitRfqCount'),
    });
  }
  closeErrorCSVModel() {
    this.modalReference.close();
  }
  singleDecline() {
    this._rfqService.setRetractAward(this.rfqPartId, this.statusId, this.rfqId).subscribe(
      response => {
        if (!response.isError) {
          this._toastr.success('Your award has been retracted', 'Success!');
          this._rfqService.setRfqAwardEvent(true);
          this.retractAwardEvent.emit(true);
          this.closeErrorCSVModel();
        } else {
          this._toastr.error(response.messages, 'Error!');
          this.closeErrorCSVModel();
        }
      }
    );

  }
  toggle(val) {
    if (this.showBlock === null || this.showBlock !== val) {
      this.showBlock = val;
    } else {
      this.showBlock = null;
    }
  }
}
