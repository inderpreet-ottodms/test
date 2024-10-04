import { Component, OnInit } from '@angular/core';
import { ISupplierRFQViewModel, IRfqSupplierLikesViewModel, IsupplierRfqFilterViewModel } from '../../../../../core/models/rfqModel';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import * as moment from 'moment';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
@Component({
  selector: 'app-specialinvite-rfq',
  templateUrl: './specialinvite-rfq.component.html',
  styleUrls: ['./specialinvite-rfq.component.scss']
})
export class SpecialinviteRfqComponent implements OnInit {

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
  detailRfq(id) {
    localStorage.setItem('isDashboard', 'true');
    // localStorage.setItem('supplierRfqDetailId', id);
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/supplier/supplierRfqDetails'], { queryParams: { rfqId: encryptedRfqID }});
  }
  getRfqList() {
    this.isLoader = true;
    this.isupplierRfqFilterViewModel.contactId = this.loggedId;
    this.isupplierRfqFilterViewModel.companyId = this.loggedCompanyId;
    this.isupplierRfqFilterViewModel.rfqType = 5;
    this._SupplierService.getSupplierRfq(this.isupplierRfqFilterViewModel).subscribe(
      result => {
        if (result['result'] === true) {
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
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
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
  likeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = true;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = false;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            let data = this._rfqService.get('likedRfqCount');
            data = data + 1;
            this._rfqService.set(data, 'likedRfqCount');
            // this.getCountsOfRfqs();
            this.initiRfqSupplierLikesViewModel();
            const rfqdata = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
            rfqdata.isRfqLike = true;
            rfqdata.isRfqDisLike = false;
            // this.getRfqList();
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }
  removelikeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = false;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = isDislike;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            let data = this._rfqService.get('likedRfqCount');
            data = data - 1;
            this._rfqService.set(data, 'likedRfqCount');
            const rfqdata = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
            rfqdata.isRfqLike = false;
            rfqdata.isRfqDisLike = isDislike;
            // this.getCountsOfRfqs();
            this.initiRfqSupplierLikesViewModel();
            // this.getRfqList();
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }

  removeDisLikeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = false;
      this.iRfqSupplierLikesViewModel.isRfqLike = isLike;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;
      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            const data = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
            data.isRfqDisLike = false;
            data.isRfqLike = isLike;
            // this.getRfqList();
            this.initiRfqSupplierLikesViewModel();
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }
  disLikeRfq(rfqId, isLike, isDislike) {
    this.initiRfqSupplierLikesViewModel();
    const currentDate = new Date();
    const currentRfq = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
    if (!currentRfq.result) {
      currentRfq.result = true;
      this.iRfqSupplierLikesViewModel.companyId = this.loggedCompanyId;
      this.iRfqSupplierLikesViewModel.contactId = this.loggedId;
      this.iRfqSupplierLikesViewModel.rfqId = rfqId;
      this.iRfqSupplierLikesViewModel.isRfqLike = false;
      this.iRfqSupplierLikesViewModel.isRfqDisLike = true;
      this.iRfqSupplierLikesViewModel.likeDate = currentDate;

      this._SupplierService.rfqLikeOrDislike(this.iRfqSupplierLikesViewModel).subscribe(
        result => {
          this.iRfqSupplierLikesViewModel = result['data'];
          if (result['result'] === true) {
            if (isLike && !isDislike) {
              let data = this._rfqService.get('likedRfqCount');
              if (data !== 0) {
                data = data - 1;
                this._rfqService.set(data, 'likedRfqCount');
                const rfqData = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
                rfqData.isRfqDisLike = true;
                rfqData.isRfqLike = false;
              }
            } else {
              const rfqData = this.iRFQViewModelColl.find(m => m.rfqId === rfqId);
              rfqData.isRfqDisLike = true;
              rfqData.isRfqLike = isLike;
            }
            // this.getCountsOfRfqs();
            // this.getRfqList();
            this.initiRfqSupplierLikesViewModel();
            currentRfq.result = false;
            this._toastr.success(result['errorMessage'], 'Success!');
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }
  }
  getLoadableImg(originalFileName: string) {
    return this.defaultAwsPath + originalFileName;
  }
  sortMessage(tab) {
    switch (tab) {
      case 'Material': {
        if ( this.toggle) {
        this.iRFQViewModelColl.sort((b, a) => a.partsMaterialName.localeCompare(b.partsMaterialName));
        } else {
          this.iRFQViewModelColl.sort((b, a) =>  b.partsMaterialName.localeCompare(a.partsMaterialName));
        }
        this.toggle = !this.toggle;
        break;
      }

      case 'Buyer': {
        if ( this.toggle2) {
        this.iRFQViewModelColl.sort((b, a) => a.companyName.localeCompare(b.companyName));
        } else {
          this.iRFQViewModelColl.sort((b, a) => b.companyName.localeCompare(a.companyName));
        }
        this.toggle2 = !this.toggle2;
        break;
      }

      case 'Process': {
        if ( this.toggle3) {
        this.iRFQViewModelColl.sort((b, a) => a.partCategoryName.localeCompare(b.partCategoryName));
        } else {
          this.iRFQViewModelColl.sort((b, a) => b.partCategoryName.localeCompare(a.partCategoryName));
        }
        this.toggle3 = !this.toggle3;
        break;
      }

      case 'Closes': {
        if ( this.toggle4) {
        this.iRFQViewModelColl.sort((b, a) => new Date(a.quotesNeededBy).getTime() - new Date(b.quotesNeededBy).getTime());
        } else {
          this.iRFQViewModelColl.sort((b, a) => new Date(b.quotesNeededBy).getTime() - new Date(a.quotesNeededBy).getTime());
        }

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
}
