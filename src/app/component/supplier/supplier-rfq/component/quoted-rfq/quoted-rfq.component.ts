import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { IRfqSupplierLikesViewModel, ISupplierRFQViewModel, IsupplierRfqFilterViewModel } from '../../../../../core/models/rfqModel';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
@Component({
  selector: 'app-quoted-rfq',
  templateUrl: './quoted-rfq.component.html',
  styleUrls: ['./quoted-rfq.component.scss']
})
export class QuotedRfqComponent implements OnInit {

  iRFQViewModelColl: ISupplierRFQViewModel[];
  iRFQViewModel: ISupplierRFQViewModel;
  iRfqSupplierLikesViewModel: IRfqSupplierLikesViewModel;
  // Model Instance End
  isupplierRfqFilterViewModel: IsupplierRfqFilterViewModel;
  // variable Declarations

  isLoader: boolean;
  isRfqAvailable: boolean;
  totalRfq: number;
  defaultAwsPath = '';
  toggle: boolean;
  toggle2: boolean;
  toggle3: boolean;
  toggle4: boolean;
  toggle5: boolean;
  sortProperty: string = 'rfqId';
  sortOrder = 1;
  constructor(private _rfqService: RfqService, private _toastr: ToastrService,
    private router: Router,
    private _SupplierService: SupplierService, private _ProfileService: ProfileService) {
    this.isRfqAvailable = false;
    this.totalRfq = 0;
    this.iRFQViewModelColl = [];
    this.toggle = false;
    this.toggle2 = false;
    this.toggle3= false;
    this.toggle4 = false;
    this.toggle5 = false;
    this.isupplierRfqFilterViewModel = {
      contactId: 0,
      companyId: 0,
      rfqType: 0,
      processIdList: [],
      pageSize: 50,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: '',
      more_records: true,
      currentDate:  moment().format(),
    };
  }
  ngOnInit() {
    this.getRfqList();
  }
  utcDate (date) {
    return moment.utc(date).toDate();
   }
  getRfqList() {
    this.isLoader = true;
    this.isupplierRfqFilterViewModel.contactId = this.loggedId;
    this.isupplierRfqFilterViewModel.companyId = this.loggedCompanyId;
    this.isupplierRfqFilterViewModel.rfqType = 6;
    this._SupplierService.getSupplierRfq(this.isupplierRfqFilterViewModel).subscribe(
      result => {
        if (result['result'] ===  true) {
          this.iRFQViewModelColl  = result['data'];
          if (this.iRFQViewModelColl.length > 10) {
            this.iRFQViewModelColl = [];
            this.iRFQViewModelColl = result['data'].slice(0, 10);
          }
        if (this.iRFQViewModelColl.length !== 0) {
          this.totalRfq = this.iRFQViewModelColl.length;
          this.isLoader = false;
        } else {
          this.totalRfq = this.iRFQViewModelColl.length;
          this.isLoader = false;
          this.isRfqAvailable = true;
        }
        } else {
          this.totalRfq = this.iRFQViewModelColl.length;
          this.isLoader = false;
          this.isRfqAvailable = true;
        }

      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  get loggedCompanyId() {
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  detailRfq(id) {
    localStorage.setItem('isDashboard', 'true');
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/supplier/supplierRfqDetails'], { queryParams: { rfqId: encryptedRfqID }});
  }

  initiRfqSupplierLikesViewModel () {
    this.iRfqSupplierLikesViewModel = {
      rfqSupplierLikesId: 0,
      rfqId: 0,
      contactId: 0,
      companyId: 0,
      isRfqDisLike: null,
      isRfqLike: null,
      likeDate: null,
      errorMessage: '',
      result: false,
    };
  }

  getLoadableImg(originalFileName: string) {
    return this.defaultAwsPath + originalFileName;
  }

  sortMessage(tab) {
    switch (tab) {
      case 'Material': {
        this.sortBy("partsMaterialName");
        this.toggle = !this.toggle;
        break;
      }

      case 'Post Process': {
        this.sortBy("postProductionProcessName");
        this.toggle2 = !this.toggle2;
        break;
      }

      case 'Process': {
        this.sortBy("partCategoryName");
        this.toggle3 = !this.toggle3;
        break;
      }

      case 'Closes': {
        this.sortBy("quotesNeededBy");
        this.toggle4 = !this.toggle4;
        break;
      }

      case 'Quantity': {
        if ( this.toggle5) {
        this.iRFQViewModelColl.sort((b, a) => a.partQty - b.partQty);
        } else {
          this.iRFQViewModelColl.sort((b, a) =>b.partQty - a.partQty);
        }
        this.toggle5 = !this.toggle5;
        break;
      }
    }
}
sortBy(property: string) {
  this.sortOrder = property === this.sortProperty ? (this.sortOrder * -1) : 1;
  this.sortProperty = property;
  this.iRFQViewModelColl = [... this.iRFQViewModelColl.sort((a: any, b: any) => {
      let result = 0;
      if (a[property] < b[property]) {
          result = -1;
      }
      if (a[property] > b[property]) {
          result = 1;
      }
      return result * this.sortOrder;
  })];
}
}
