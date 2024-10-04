import { Component, OnInit, Input } from '@angular/core';
import { RfqService } from '../../../../core/services/rfq/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { IBuyerQuotesList, IBuyerQuotesViewModel } from '../../../../core/models/rfqModel';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ProfileService } from '../../../../core/services/profile/profile.service';
@Component({
  selector: 'app-dash-new-quotes',
  templateUrl: './dash-new-quotes.component.html',
  styleUrls: ['./dash-new-quotes.component.scss']
})
export class DashNewQuotesComponent implements OnInit {

  @Input('rfqId') rfqId: number;
  isGridView: boolean;
  searchFilterValue: string;
  stateFilterValue: string;
  cloneRfqName: string;
  sortFilterValue: string;
  isLoader: boolean;
  isRfqAvailable: boolean;
  totalRfq: number;
  activeStatusFilterBtn: string;
  isCreateRFQBodyBtnDisabled: boolean;
  isRFQInProgBodyBtnDisabled: boolean;
  toggleNoRFQBodyBtn = true;
  toggle1: boolean;
  toggle2: boolean;
  toggle3: boolean;
  toggle4: boolean;
  toggle5: boolean;
  // Variable Declarations Ends
 iBuyerQuotesListColl: IBuyerQuotesList[];
 iBuyerQuotesViewModel: IBuyerQuotesViewModel;

  constructor(private _rfqService: RfqService, private _toastr: ToastrService, private router: Router, private _ProfileService: ProfileService) {
    this.isLoader = true;
    this.iBuyerQuotesListColl = [];
    this.toggle1 = false;
    this.toggle2 = false;
    this.toggle3 = false;
    this.toggle4 = false;
    this.toggle5 = false;
    this.iBuyerQuotesViewModel = {
      rfqId: 0 ,
      contactId: this.LoggedId,
       pageSize: 10,
       pageNumber: 1,
       searchText: '',
       isRfqResubmitted: false,
       totalRecords: 0,
       isOrderByDesc: true,
       orderBy: '',
       more_records: true
    };
   }

  ngOnInit() {
    this.rfqId = this.currentRfqId;
    this.getBuyerQuotingList();
  }

  get currentRfqId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('detailRfqId'));
  }
  get LoggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  getBuyerQuotingList() { // this.currentRfqId-1092940
    this._rfqService.GetBuyerQuotingList(this.iBuyerQuotesViewModel).subscribe(
    // this._rfqService.GetBuyerQuotingList(1092940, 0).subscribe(
      result => {
        if (result['result'] === true) {
          this.iBuyerQuotesListColl = result['data'];
          this.iBuyerQuotesListColl.sort((a, b) => new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime());
          this.iBuyerQuotesListColl = this.iBuyerQuotesListColl.slice(0, 10);
          this.iBuyerQuotesListColl.forEach(element => {
            element.quoteDate = moment.utc(element.quoteDate).toDate();
          });
          if (this.iBuyerQuotesListColl.length !== 0) {
            this.totalRfq = this.iBuyerQuotesListColl.length;
            this.isLoader = false;
          } else {
            this.totalRfq = this.iBuyerQuotesListColl.length;
            this.isLoader = false;
            this.isRfqAvailable = true;
          }
        } else {
          this.totalRfq = 0;
          this.isLoader = false;
          this.isRfqAvailable = true;
        }

      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  detailRfq(id) {
    // localStorage.setItem('detailRfqId', id);
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/rfq/rfqdetail'],{ queryParams: { rfqId: encryptedRfqID }});
  }
  detailRfqquote(id) {
    localStorage.setItem('detailRfqId', id);
    localStorage.setItem('quotesTab', 'true');
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/rfq/rfqdetail'],{ queryParams: { rfqId: encryptedRfqID }});
  }
  openSidePanel(contactId, contactName , companyName) {
    // console.log('contactId', contactId);
    // console.log('contactName', contactName);
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'supplierProfileDrawer');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(contactId, 'quoteContactId');
    this._rfqService.set(contactName, 'quoteContactName');
    this._rfqService.set(companyName, 'quoteCompanyName');
  }
  openMessageDrawer(event, contactId, messageRFQId, fromContName) {
    event.stopPropagation();
    if (localStorage.getItem('isEmailVerify') == 'false') {
      this._toastr.warning("Please verify your email.", 'Warning');
    } else {
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'messageRfq');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(contactId, 'selectContactIdsForMEessage');
    this._rfqService.set(messageRFQId, 'selectContactRFQId');
    this._rfqService.set(fromContName, 'nameOfBuyer');
    }
  }

  sortMessage(tab) {
    switch (tab) {
      case 'Qty1': {
        if ( this.toggle2) {
        this.iBuyerQuotesListColl.sort((b, a) =>a.qty1 - b.qty1);
        } else {
          this.iBuyerQuotesListColl.sort((b, a) =>b.qty1 - a.qty1);
        }
        this.toggle2 = !this.toggle2;
        break;
      }

      case 'Qty2': {
        if ( this.toggle3) {
        this.iBuyerQuotesListColl.sort((b, a) =>a.qty2 - b.qty2);
        } else {
          this.iBuyerQuotesListColl.sort((b, a) =>b.qty2 - a.qty2);
        }
        this.toggle3 = !this.toggle3;
        break;
      }

      case 'Qty3': {
        if ( this.toggle4) {
        this.iBuyerQuotesListColl.sort((b, a) =>a.qty3 - b.qty3);
        } else {
          this.iBuyerQuotesListColl.sort((b, a) =>b.qty3 - a.qty3);
        }
        this.toggle4 = !this.toggle4;
        break;
      }

      case 'Date': {
        if ( this.toggle1) {
        this.iBuyerQuotesListColl.sort((b, a) => new Date(a.quoteDate).getTime() - new Date(b.quoteDate).getTime());
        } else {
          this.iBuyerQuotesListColl.sort((b, a) => new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime());
        }

        this.toggle1 = !this.toggle1;
        break;
      }

      case 'Status': {
        if ( this.toggle5) {
          this.iBuyerQuotesListColl.sort((b, a) => Number(a.isReviewed) - Number(b.isReviewed));
        } else {
          this.iBuyerQuotesListColl.sort((b, a) => Number(b.isReviewed) - Number(a.isReviewed));
        }
        this.toggle5 = !this.toggle5;
        break;
      }

    }
}
isModelShow() {
  return this._rfqService.get('isModelShow');
  }
  redirectToCreateRfqPage(){
    this._ProfileService.redirectToNewBuyer("rfq/editrfq");
  }
}
